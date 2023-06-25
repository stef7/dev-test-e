import { extendTheme, type ThemeExtension } from "@chakra-ui/react";

const extension: ReturnType<ThemeExtension> = {
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
};

const theme = extendTheme(extension) as typeof extension;

export default theme;
