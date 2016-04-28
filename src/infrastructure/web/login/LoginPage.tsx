import * as React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class LoginPage extends React.Component<any, any> {
    render() {
        return (
            <div id="login-page">
                <div className="row center-sm center-xs">
                    <div className="col-sm-6">
                        <h2>Login</h2>
                    </div>
                </div>
                <div className="row center-sm center-xs">
                    <div className="col-sm-4 col-xs-10">
                        <TextField
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
                            style={{width: '100%'}}
                            hintText="Enter your password"
                            floatingLabelText="Password"
                            type="password"
                        />
                    </div>
                </div>
                <div className="row center-sm center-xs" >
                    <div className="col-sm-4 col-xs-10">
                        <RaisedButton style={{float: 'right'}} label="Login" primary={true} />
                        <RaisedButton style={{float: 'right', marginRight: '10px'}} label="Cancel" secondary={true} />
                    </div>
                </div>
            </div>
        );
    }
}
