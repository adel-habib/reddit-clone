import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import { createClient, Provider } from 'urql'

const client = createClient({url: 'http://localhost:4000/graphql'})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client }>
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
    </Provider>
  )
}

export default MyApp
