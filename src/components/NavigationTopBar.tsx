import React, { useState, useEffect } from 'react';

import { withRouter, RouteComponentProps } from "react-router";


import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DarkModeIcon from '@material-ui/icons/NightsStay';
import LightModeIcon from '@material-ui/icons/WbSunny';
import { useMoralis } from "react-moralis";
import { PropsFromRedux } from '../containers/NavigationTopBarContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

const NavigationTopBar = (props: PropsFromRedux & RouteComponentProps) => {
  const classes = useStyles()

  const { history } = props;


  const [localShowLeftMenu, setLocalShowLeftMenu] = useState(props.showLeftMenu)
  const [localDarkMode, setLocalDarkMode] = useState(props.darkMode)

  useEffect(() => {
    setLocalShowLeftMenu(props.showLeftMenu)
  }, [props.showLeftMenu])

  useEffect(() => {
    setLocalDarkMode(props.darkMode)
  }, [props.darkMode])

  const { authenticate, isAuthenticated, logout } = useMoralis();

    useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

    const login = async () => {
      if (!isAuthenticated) {

        await authenticate({signingMessage: "Log in using Moralis" })
          .then(function (user) {
            console.log("logged in user:", user);
            console.log(user!.get("ethAddress"));
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    const logOut = async () => {
      await logout();
      console.log("logged out");
    }

  return (
    <div className={classes.root}>
      <AppBar style={{ background: 'linear-gradient(-90deg, #272727, #000000)' }} position="static">
        <Toolbar>
          <IconButton onClick={() => props.setShowLeftMenu(!localShowLeftMenu)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <span style={{ cursor: 'pointer' }} onClick={() => history.push('/')}>NFT Market</span>
          </Typography>
          {isAuthenticated ? (
            <Button color="secondary" variant="contained" onClick={() => logOut()}>Disconnect</Button>
          ) : (
            <Button color="primary" variant="contained" onClick={() => login()}>Connect</Button>
          )}
          
          <IconButton color="inherit" onClick={() => props.setDarkMode(!localDarkMode)} aria-label="delete" className={classes.margin}>
            {localDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(NavigationTopBar);