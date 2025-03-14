import { useCallback, useEffect, useState } from 'react';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDatabase } from './utils/database';
import AppStacks from './components/navigation/AppStacks';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { lightColors } from './constants/themeColors';
import ProductsContextProvider from './state/context/products-context';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

registerTranslation('en-GB', enGB);
preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: lightColors,
};

export default function App() {
  const queryClient = new QueryClient();

  const [dbInitialized, setDbInitialized] = useState(false);

  // initialize database
  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
      } catch (e) {
        console.warn(e);
      } finally {
        setDbInitialized(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) {
    return null;
  }

  return (
    // @ts-ignore
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer onReady={onLayoutRootView}>
          <ProductsContextProvider>
            <GestureHandlerRootView>
            <AppStacks />
            </GestureHandlerRootView>
          </ProductsContextProvider>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
