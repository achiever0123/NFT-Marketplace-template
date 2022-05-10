import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from "react-router";
import axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import TextField from '@material-ui/core/TextField';
import { useMoralis } from "react-moralis";
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Moralis from 'moralis';
import Web3 from "web3"
import { contractABI, contractAddress } from "../contract";
import { AbiItem } from 'web3-utils'

import { useMoralisWeb3Api } from "react-moralis";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        marginBottom: 15,
        textAlign: 'center',
    },

    title: {
        fontSize: 14,
    },
    container: {
        marginTop: 15,
        textAlign: 'center'
    },
    connectionButton: {
        width: '100%',
        marginBottom: 15,
    },
    margin: {
        marginTop: 15,
        marginBottom: 15
    },
    paper: {
        padding: 15,
        marginBottom: 40
    },
    input: {
        display: 'none',
    },
    cardGrid: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 2,
    }
});
const MintPage = (props: RouteComponentProps) => {
    const classes = useStyles();


    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(Object);
    const [nftdata, setNftdata] = useState([]);
    // const [price, setPrice] = useState([]);

    const { authenticate, isAuthenticated, user, account } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    useEffect(() => {
        if (isAuthenticated) {
            const fetchNFTs = async () => {
                const rinkebyNFTs = await Web3Api.Web3API.account.getNFTs({ chain: "rinkeby", address: `${account}` })
                let data: any = rinkebyNFTs.result;

                const items: any = await Promise.all(data?.map(async (nft: any) => {
                    const tokenURI = nft.token_uri;
                    if (tokenURI) {
                        const meta = await axios.get(tokenURI)
                        const item = {
                            name: meta.data.name,
                            description: meta.data.description,
                            image: meta.data.image
                        }
                        return item;
                    }
                }))
                setNftdata(items);
                console.log(nftdata)
            }; console.log(user)
            fetchNFTs().catch(console.error);
        }

    }, [Web3Api.Web3API.account, account, isAuthenticated, nftdata, user]);

    


    const login = async () => {
        if (!isAuthenticated) {

            await authenticate({ signingMessage: "Log in using Moralis" })
                .then(function (user) {

                    console.log("logged in user:", user);
                    console.log(user!.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const web3 = new Web3(Web3.givenProvider);
    const onSubmit = async (e: any) => {

        e.preventDefault();
        console.log("submit event");
        try {
            // Attempt to save image to IPFS
            const file1 = new Moralis.File(file.name, file);
            await file1.saveIPFS();
            const file1url = file1.url();
            console.log("file1url" + file1url)
            // Generate metadata and save to IPFS
            const metadata = {
                name,
                description,
                image: file1url,
            };
            const file2 = new Moralis.File(`${name}metadata.json`, {
                base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
            });
            await file2.saveIPFS();
            const metadataurl = file2.url();
            console.log("file2url" + metadataurl)
            // Interact with smart contract
            const contract = new web3.eth.Contract(contractABI as AbiItem[], contractAddress);
            const response = await contract.methods
                .mint(metadataurl)
                .send({ from: user?.get("ethAddress") });
            // Get token id
            const tokenId = response.events.Transfer.returnValues.tokenId;
            // Display alert
            alert(
                `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
            );
        } catch (err) {
            console.error(err);
            alert("An error occured!");
        }
    };

    return (
        <Container className={classes.container} >
            <div className="button-container">
                {!isAuthenticated &&
                    <Button className={classes.connectionButton} color="primary" variant="contained" onClick={() => login()}>Connect</Button>
                }
            </div>

            {isAuthenticated && (
                <>
                    <Paper className={classes.paper}>
                        <h1 style={{ marginTop: 0, paddingTop: 0 }}>Mint ERC721 NFT</h1>
                    </Paper>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Paper className={classes.paper}>
                                <form onSubmit={onSubmit}>
                                    <div>
                                        <div>
                                            <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={(e: any) => setFile(e.target.files[0])} />
                                            <label htmlFor="icon-button-file">
                                                <IconButton color="primary" aria-label="upload picture" component="span">
                                                    <PhotoCamera />
                                                </IconButton>
                                            </label>
                                        </div>
                                        <TextField id="nft-name" label="Name" type="text" size="small" variant="outlined" onChange={(e) => setName(e.target.value)} className={classes.margin} />
                                        <TextField id="nft-description" label="Description" type="text" size="small" variant="outlined" onChange={(e) => setDescription(e.target.value)} />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.margin}
                                            type="submit"
                                        >
                                            Mint
                                        </Button>
                                    </div>
                                </form>
                            </Paper>
                        </Grid>
                        <Grid item xs={9}>
                            <Paper className={classes.paper}>
                            <Grid container spacing={4}>
                                {
                                    nftdata.map((nft: any, key: number) => {
                                        return (
                                            <Grid item key={key} xs={12} sm={6} md={4}>
                                                <Card className={classes.card}>
                                                    <CardMedia
                                                        className={classes.cardMedia}
                                                        image={nft?.image}
                                                        title={nft?.name}
                                                    />
                                                    <CardContent className={classes.cardContent}>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {nft?.name}
                                                        </Typography>
                                                        <Typography>
                                                            {nft?.description}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                    <TextField id="nft-price" label="Price" type="text" size="small" variant="outlined" className={classes.margin} />
                                                        <Button size="small" color="primary">
                                                            Sell
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        );
                                    })
                                }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>


                </>
            )
            }
        </Container >
    )
};

export default withRouter(MintPage);