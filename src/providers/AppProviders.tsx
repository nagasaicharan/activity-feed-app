import React, { PropsWithChildren } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { useDeviceContext } from 'twrnc';
import { apolloClient } from '../lib/apollo/client';
import { store } from '../store';
import { tw } from '@ui';

export const AppProviders = ({ children }: PropsWithChildren) => {
  useDeviceContext(tw);

  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </ApolloProvider>
    </Provider>
  );
};
