import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({
    palette: {
        type: "dark",
        grey: {
            800: "#000000", // overrides failed
            900: "#121212" // overrides success
        },
        background: {
            paper: "#000000"
        },
        primary: {
            light: '#fff',
            main: '#09d3ac',
            dark: '#eee',
            contrastText: '#eee'
        },
        secondary: {
            main: '#40739e',
            dark: '#eee',
            light: '#fff',
            contrastText: '#eee'

        },
    },
    typography: {
        fontFamily: "Nunito Sans, Roboto, sans-serif",
        fontSize: 20,
        allVariants: {
            color: '#eee'
        }
    },
});