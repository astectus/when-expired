import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Platform } from 'react-native';
import { createTheme, ThemeProvider, lightColors, darkColors, Button } from '@rneui/themed';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';

import AddProductModal from './components/AddProductModal';
import ProductListItem from './components/ProductListItem';
import Product from './models/Product';
import { init, insertProduct, fetchProducts } from './utils/database';

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
  darkColors: {
    ...Platform.select({
      default: darkColors.platform.android,
      ios: darkColors.platform.ios,
    }),
  },
  mode: 'light',
  components: {
    Button: {
      raised: true,
    },
  },
});

preventAutoHideAsync();

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState(false);

  const [dbInitialized, setDbInitialized] = useState(false);

  const loadProducts = async () => {
    const products = await fetchProducts();
    setProducts(products);
  };

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

  useEffect(() => {
    if (dbInitialized) {
      loadProducts();
    }
  }, [dbInitialized]);

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) {
    return null;
  }

  function deleteItem(id: string) {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const addProduct = async (product: Product) => {
    await insertProduct(product);
    await loadProducts();
    setVisible(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.appContainer} onLayout={onLayoutRootView}>
        <Button title="Add New Product" onPress={toggleOverlay} />
        <AddProductModal
          visible={visible}
          toggleOverlay={toggleOverlay}
          onAddProduct={addProduct}
        />
        <View style={styles.goalsContainer}>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <ProductListItem
                productItem={item}
                // eslint-disable-next-line react/jsx-no-bind
                onDeleteItem={deleteItem}
              />
            )}
            keyExtractor={(item) => item.id}
            alwaysBounceVertical={false}
          />
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  goalsContainer: {
    flex: 5,
  },
});
