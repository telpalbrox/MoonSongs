import * as React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {LoginState} from "./login/loginReducer";
import {MoonSongsContainerState} from "./moonSongsReducer";
import RouterProps = ReactRouter.RouterProps;
import { closeError } from './moonSongsActions';

export interface MoonSongsState {
    login: LoginState;
    moonSongs: MoonSongsContainerState
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
        browserHistory.push('/login');
    }

    handleCloseError() {
        this.props.dispatch(closeError());
    }
}

export default connect(MoonSongs.mapStateToProps)(MoonSongs);
