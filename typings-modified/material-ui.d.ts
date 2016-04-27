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
