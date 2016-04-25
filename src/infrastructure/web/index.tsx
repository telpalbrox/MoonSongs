/// <reference path="../../../typings-modified/index.d.ts" />
import * as React from 'react';
import { render } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const MoonBar = () => (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <AppBar
            title="MoonSongs"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
    </MuiThemeProvider>
);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render(<MoonBar />, document.getElementById('root'));
