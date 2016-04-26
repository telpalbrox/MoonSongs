/// <reference path="../../../typings-modified/index.d.ts" />
import * as React from 'react';
import { render } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import loginReducer from './login/loginReducer';
import Login from './login/loginContainer';

const MoonBar = () => (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <AppBar
            title="MoonSongs"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
    </MuiThemeProvider>
);

// Add the reducer to your store on the `routing` key
const store = createStore(
    combineReducers({
        login: loginReducer,
        routing: routerReducer
    })
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        { /* Tell the Router to use our enhanced history */ }
        <Router history={history}>
            <Route path="/" component={MoonBar}>
                <Route path="login" component={Login}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render(<MoonBar />, document.getElementById('root'));
