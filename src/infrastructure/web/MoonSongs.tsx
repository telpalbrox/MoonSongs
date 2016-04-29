import * as React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import {LoginState} from "./login/loginReducer";

export interface MoonSongsState {
    login: LoginState;
}

export default class MoonSongs extends React.Component<any, any> {
    render() {
        return (<MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
                <AppBar
                    title="MoonSongs"
                    iconElementRight={<FlatButton label="Login" onTouchTap={this.goLogin} />}
                />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        </MuiThemeProvider>);
    }

    goLogin() {
        browserHistory.push('/login');
    }
}
