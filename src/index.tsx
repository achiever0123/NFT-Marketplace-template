import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './styles/index.css';
import AppContainer from './containers/AppContainer';
import reportWebVitals from './reportWebVitals';
import store from './state';
import { MoralisProvider } from 'react-moralis';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <MoralisProvider serverUrl="https://yfduvjj9td55.usemoralis.com:2053/server" appId="U90SNMdXaaFAyvjSzotGaTkULwJd0PSjGq8ME77o">
                <AppContainer />
            </MoralisProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();