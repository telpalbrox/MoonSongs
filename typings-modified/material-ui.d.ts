declare namespace ___MaterialUI {
    import RawTheme = __MaterialUI.Styles.RawTheme;
    import MuiTheme = __MaterialUI.Styles.MuiTheme;
    import React = __MaterialUI.React;
    export function getMuiTheme(baseTheme ?: RawTheme, muiTheme ?: MuiTheme): MuiTheme;
    export class MuiThemeProvider extends React.Component<any, any> {
    }
}

declare module 'material-ui/styles/getMuiTheme' {
    export import getMuiTheme = ___MaterialUI.getMuiTheme;
    export default getMuiTheme;
}

declare module 'material-ui/styles/MuiThemeProvider' {
    export import MuiThemeProvider = ___MaterialUI.MuiThemeProvider;
    export default MuiThemeProvider;
}

declare module 'material-ui/AppBar' {
    export import AppBar = __MaterialUI.AppBar;
    export default AppBar;
}

declare module 'material-ui/FlatButton' {
    export import FlatButton = __MaterialUI.FlatButton;
    export default FlatButton;
}

declare module 'material-ui/TextField' {
    export import TextField = __MaterialUI.TextField;
    export default TextField;
}

declare module 'material-ui/RaisedButton' {
    export import RaisedButton = __MaterialUI.RaisedButton;
    export default RaisedButton;
}

declare module 'material-ui/Snackbar' {
    export import Snackbar = __MaterialUI.Snackbar;
    export default Snackbar;
}

declare module 'material-ui/MenuItem' {
    export import MenuItem = __MaterialUI.Menus.MenuItem;
    export default MenuItem;
}

declare module 'material-ui/Drawer' {
    export import Drawer = __MaterialUI.LeftNav;
    export default Drawer;
}

declare module 'material-ui/List' {
    export import List =  __MaterialUI.Lists.List;
    export import MakeSelectable =  __MaterialUI.Hoc.SelectableContainerEnhance;
    export import ListItem = __MaterialUI.Lists.ListItem;
    export default List;
}

declare module 'material-ui/GridList' {
    export import GridList = __MaterialUI.GridList.GridList;
    export import GridTile = __MaterialUI.GridList.GridTile;
    export default GridList;
}

declare module 'material-ui/IconButton' {
    export import IconButton = __MaterialUI.IconButton;
    export default IconButton;
}
