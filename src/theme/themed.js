import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import { colors } from './colors'
import { fonts } from "./fonts"

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.nike,
        },
        secondary: {
            main: colors.adidas,
        },
        accent: {
            main: colors.mizuno,
            light: colors.mizunoLight,
        },
    },
    typography: {
        h1: {
            fontFamily: fonts.main,
            letterSpacing: '0.02em',
            color: colors.nike,
            fontSize: '2em',
            padding: '0 1rem',
            margin: '0.67em 0'
        },
        h2: {
            fontFamily: fonts.secondary,
            letterSpacing: '0.02em',
            color: colors.adidas,
            fontSize: '2em',
            padding: '0 1rem',
            margin: '0.67em 0'
        },
        h4: {
            fontFamily: fonts.main,
            letterSpacing: '0.02em',
            fontSize: '1.8em',
            color: colors.mizuno,
            padding: '0 0.4rem',
        },
        body2: {
          fontSize: '1em',
          fontWeight: 'bold',
          fontFamily: fonts.secondary,
        },
        p: {
          body1: {
            fontSize: '0.8em',
          }
        }
    }
})

export default theme
