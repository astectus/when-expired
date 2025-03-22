import { useCallback, useEffect, useState } from 'react';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { LogBox, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDatabase } from './utils/database';
import AppStacks from './components/navigation/AppStacks';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { lightColors, darkColors } from './constants/themeColors';
import ProductsContextProvider from './state/context/products-context';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

registerTranslation('en-GB', enGB);
preventAutoHideAsync();

// Create custom Paper themes
const CustomLightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
};

const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
};

// Create matching navigation themes
const CustomNavigationLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.surface,
    text: lightColors.onSurface,
    border: lightColors.outline,
    notification: lightColors.error,
  },
};

const CustomNavigationDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.surface,
    text: darkColors.onSurface,
    border: darkColors.outline,
    notification: darkColors.error,
  },
};

export default function App() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;
  const navigationTheme = colorScheme === 'dark' ? CustomNavigationDarkTheme : CustomNavigationLightTheme;

  const [dbInitialized, setDbInitialized] = useState(false);

  if (__DEV__) {
    console.log('Running in development mode');
  } else {
    console.log('Running in production mode');
  }

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
        <NavigationContainer theme={navigationTheme} onReady={onLayoutRootView}>
          <ProductsContextProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
            <AppStacks />
            </GestureHandlerRootView>
          </ProductsContextProvider>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
