import RouterProps = ReactRouter.RouterProps;
import * as React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {LoginState} from "./login/loginReducer";
import {MoonSongsContainerState} from "./moonSongsReducer";
import { closeError } from './moonSongsActions';
import {SongsState} from "./songs/interfaces";

export interface MoonSongsState {
    login: LoginState;
    moonSongs: MoonSongsContainerState;
    songs: SongsState;
}

interface MoonSongsProps {
    dispatch: Function;
    error: boolean;
    errorMessage: string;
    errorDuration: number;
}

class MoonSongs extends React.Component<MoonSongsProps, any> {
    static mapStateToProps(state: MoonSongsState) {
        const { error, errorMessage, errorDuration } = state.moonSongs;
        return {
            error,
            errorMessage,
            errorDuration
        }
    }

    constructor(props) {
        super(props);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.goLogin = this.goLogin.bind(this);
    }

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
                <Snackbar
                    open={this.props.error}
                    message={this.props.errorMessage}
                    action="Ok"
                    onActionTouchTap={this.handleCloseError}
                    onRequestClose={() => {}}
                />
            </div>
        </MuiThemeProvider>);
    }

    goLogin() {
        this.props.dispatch(push('/login'));
    }

    handleCloseError() {
        this.props.dispatch(closeError());
    }
}

export default connect(MoonSongs.mapStateToProps)(MoonSongs);
