import { extendTheme, type ThemeExtension, type Theme } from "@chakra-ui/react";

const extension = {
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
} as const satisfies ReturnType<ThemeExtension>;

const theme = extendTheme(extension) as typeof extension & Theme;

export default theme;
