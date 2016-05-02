import * as React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {MoonSongsState} from "../MoonSongs";
import {login} from './loginActions';

interface LoginProps {
    userName: string;
    password: string;
    loading: boolean;
    dispatch: Function;
}

class LoginPage extends React.Component<LoginProps, any> {
    userNameInput: TextField;
    passwordInput: TextField;

    static mapStateToProps(state: MoonSongsState) {
        const { userName, password, loading } = state.login;
        return {
            userName,
            password,
            loading
        };
    }
    
    render() {
        return (
            <div id="login-page" style={{marginTop: '17vh'}}>
                <div className="row center-sm center-xs">
                    <div className="col-sm-6">
                        <h2>Login</h2>
                    </div>
                </div>
                <div className="row center-sm center-xs">
                    <div className="col-sm-4 col-xs-10">
                        <TextField
                            ref={(node) => this.userNameInput = node}
                            defaultValue={this.props.userName}
                            style={{width: '100%'}}
                            hintText="Enter your user name"
                            floatingLabelText="User name"
                            type="text"
                        />
                    </div>
                </div>
                <div className="row center-sm center-xs">
                    <div className="col-sm-4 col-xs-10">
                        <TextField
                            ref={(node) => this.passwordInput = node}
                            defaultValue={this.props.password}
                            style={{width: '100%'}}
                            hintText="Enter your password"
                            floatingLabelText="Password"
                            type="password"
                        />
                    </div>
                </div>
                <div className="row center-sm center-xs" >
                    <div className="col-sm-4 col-xs-10">
                        <RaisedButton style={{float: 'right'}} label="Login" primary={true} onTouchTap={this.onLoginClick.bind(this)} disabled={this.props.loading} />
                        <RaisedButton style={{float: 'right', marginRight: '10px'}} label="Cancel" secondary={true} />
                    </div>
                </div>
            </div>
        );
    }

    onLoginClick() {
        if(!this.userNameInput.getValue() || !this.passwordInput.getValue()) {
            return;
        }
        this.props.dispatch(login(this.userNameInput.getValue(), this.passwordInput.getValue()));
    }
}

export default connect(LoginPage.mapStateToProps)(LoginPage);
