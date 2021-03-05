import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import { colors } from './colors'

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
})

export default theme