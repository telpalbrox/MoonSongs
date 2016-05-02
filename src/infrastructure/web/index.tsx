/// <reference path="../../../typings-modified/index.d.ts" />
import * as React from 'react';
import { render } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import loginReducer from './login/loginReducer';
import moonSongsReducer from './moonSongsReducer';
import Login from './login/LoginContainer';
import MoonSongs from './MoonSongs';
import Home from './home/HomePage';
import Songs from './songs/SongsContainer';
import paginate from './common/reducers/paginate';
import { actions as songsActions } from './songs/songsActions';
import userReducer from './common/reducers/userReducer';

if(process.env.NODE_ENV === 'production') {
    require('babel-polyfill');
}

// Add the reducer to your store on the `routing` key
const store = createStore(
    combineReducers({
        login: loginReducer,
        routing: routerReducer,
        moonSongs: moonSongsReducer,
        user: userReducer,
        songs: paginate({
            types: [
                songsActions.SONGS_REQUEST,
                songsActions.SONGS_SUCCESS,
                songsActions.SONGS_FAIL
            ],
            dataKey: 'songs'
        })
    }),
    applyMiddleware(thunk, routerMiddleware(browserHistory))
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render(
    <Provider store={store}>
        { /* Tell the Router to use our enhanced history */ }
        <Router history={history}>
            <Route path="/" component={MoonSongs}>
                <IndexRoute component={Home}/>
                <Route path="login" component={Login}/>
                <Route path="songs" component={Songs}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
