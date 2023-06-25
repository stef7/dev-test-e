import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { MyErrorBoundary } from "~/components/error-boundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <MyErrorBoundary>
        <Component {...pageProps} />
      </MyErrorBoundary>
    </ChakraProvider>
  );
}
