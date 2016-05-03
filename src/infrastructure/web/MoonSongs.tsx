import RouterProps = ReactRouter.RouterProps;
import * as React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import Drawer from 'material-ui/Drawer';
import { MakeSelectable, List, ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import {LoginState} from "./login/loginReducer";
import {MoonSongsContainerState} from "./moonSongsReducer";
import { closeError, openDrawer, closeDrawer } from './moonSongsActions';
import {SongsState} from "./songs/interfaces";
import { removeUser } from './common/actions/userActions';
import RouterState = ReactRouter.RouterState;
import Location = HistoryModule.Location;
require('./moonSongs.css');

export interface MoonSongsState {
    login: LoginState;
    moonSongs: MoonSongsContainerState;
    songs: SongsState;
    user: {uuid: string, userName: string, token: string};
    routing: RouterState;
}

interface MoonSongsProps {
    dispatch?: Function;
    error: boolean;
    errorMessage: string;
    errorDuration: number;
    logged: boolean;
    drawerOpen: boolean;
    location?: Location;
    path: string;
}

const DrawerList = MakeSelectable(List);

class MoonSongs extends React.Component<MoonSongsProps, any> {
    static mapStateToProps(state: MoonSongsState, ownProps: MoonSongsProps): MoonSongsProps {
        const { error, errorMessage, errorDuration } = state.moonSongs;
        const logged = !!state.user.token;
        const drawerOpen = state.moonSongs.drawerOpen;
        return {
            error,
            errorMessage,
            errorDuration,
            logged,
            drawerOpen,
            path: ownProps.location.pathname
        };
    }

    constructor(props) {
        super(props);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.goLogin = this.goLogin.bind(this);
        this.logout = this.logout.bind(this);
        this.onDrawerChange = this.onDrawerChange.bind(this);
    }

    render() {
        return (<MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
                <AppBar
                    title={<Link className="link" to="/">MoonSongs</Link>}
                    iconElementRight={this.props.logged ?
                    <FlatButton label="Logout" onTouchTap={this.logout} /> :
                    <FlatButton label="Login" onTouchTap={this.goLogin} />}
                    onLeftIconButtonTouchTap={() => this.props.dispatch(openDrawer())}
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
                <Drawer
                    docked={false}
                    open={this.props.drawerOpen}
                    onRequestChange={(open) => open ? this.props.dispatch(openDrawer()) : this.props.dispatch(closeDrawer()) } >
                    <DrawerList value={this.props.path} onChange={this.onDrawerChange}>
                        { this.props.logged && <ListItem value="/songs" primaryText="Songs" />}
                        { !this.props.logged && <ListItem value="/login" primaryText="Login" />}
                    </DrawerList>
                </Drawer>
            </div>
        </MuiThemeProvider>);
    }

    goLogin() {
        this.props.dispatch(push('/login'));
    }

    handleCloseError() {
        this.props.dispatch(closeError());
    }

    logout() {
        this.props.dispatch(removeUser());
        this.props.dispatch(push('/'))
    }

    onDrawerChange(e, value) {
        this.props.dispatch(closeDrawer());
        this.props.dispatch(push(value));
    }
}

export default connect(MoonSongs.mapStateToProps)(MoonSongs);
