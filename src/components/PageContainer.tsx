import React from 'react';
import {Route, withRouter, Switch, RouteComponentProps} from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Navigation from './Navigation';
import HomePage from '../pages/HomePage';
import BuyPage from '../pages/BuyPage';
import SellPage from '../pages/SellPage';
import MintPage from '../pages/MintPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  }),
);

const PageContainer = () => {

    const classes = useStyles();

    return (
        <Navigation>
            <div className={classes.root}>
                <Switch>
                    <Route path="/" exact render={(props) => homeRoute(props)} />
                    <Route path="/mint" exact render={(props) => mintRoute(props)} />
                    <Route path="/buy" exact render={(props) => buyRoute(props)} />
                    <Route path="/sell" exact render={(props) => sellRoute(props)} />
                </Switch>
            </div>
        </Navigation>
    )
}

const homeRoute = (props: RouteComponentProps) => {
    return (
        <HomePage/>
    )
}

const buyRoute = (props: RouteComponentProps) => {
    return (
        <BuyPage/>
    )
}

const mintRoute = (props: RouteComponentProps) => {

    return (
        <MintPage />
    )
}

const sellRoute = (props: RouteComponentProps) => {

    return (
        <SellPage />
    )
}

export default withRouter(PageContainer);