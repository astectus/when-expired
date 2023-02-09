import { useCallback, useEffect, useState } from 'react';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { init } from './utils/database';
import AppStacks from './components/navigation/AppStacks';
import 'intl';
import 'intl/locale-data/jsonp/en';

registerTranslation('en-GB', enGB);
preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

export default function App() {
  const queryClient = new QueryClient();

  const [dbInitialized, setDbInitialized] = useState(false);

  // initialize database
  useEffect(() => {
    async function prepare() {
      try {
        await init();
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
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer onReady={onLayoutRootView}>
          <AppStacks />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
