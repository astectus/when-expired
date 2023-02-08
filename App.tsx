import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { init } from './utils/database';
import HomeTabs from './components/navigation/HomeTabs';
import { NavigationContainer } from '@react-navigation/native';
import AppStacks from './components/navigation/AppStacks';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

preventAutoHideAsync();

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
