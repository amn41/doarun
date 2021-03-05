import createMuiTheme, { Theme, ThemeOptions } from "@material-ui/core/styles/createMuiTheme"
import { Palette } from "@material-ui/core/styles/createPalette"
import { colors } from './colors'

interface CustomPalette extends Palette {
    accent: {
        main: string,
        light: string,
    },
}

interface CustomThemeOptions extends ThemeOptions {
    palette: CustomPalette;
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.nike,
        },
        secondary: {
            main: colors.nike,
        },
        accent: {
            main: colors.mizuno,
            light: colors.mizunoLight,
        },
    },
} as CustomThemeOptions)

export default theme