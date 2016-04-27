import * as React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';

export default class MoonSongs extends React.Component<any, any> {
    render() {
        return (<MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
                <AppBar
                    title="MoonSongs"
                    iconElementRight={<FlatButton label="Login" onTouchTap={this.goLogin} />}
                />
                {this.props.children}
            </div>
        </MuiThemeProvider>);
    }

    goLogin() {
        browserHistory.push('/login');
    }
}
