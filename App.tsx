import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Platform } from 'react-native';
import { createTheme, ThemeProvider, lightColors, darkColors, Button } from '@rneui/themed';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';

import { QueryClientProvider, QueryClient } from 'react-query';
import AddProductModal from './components/AddProductModal';
import ProductListItem from './components/ProductListItem';
import Product from './models/Product';
import { init, insertProduct, fetchProducts, deleteProduct } from './utils/database';
import Scanner from './components/Scanner';
import { BarCode } from './models/BarCode';
import { getProductByBarcode } from './api/api';
import { useQuery } from 'react-query';
import QueryData from './components/QueryData';

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
  const [scanProductVisible, setScanProductVisible] = useState(false);
  const [barCode, setBarCode] = useState<BarCode | null>(null);
  const queryClient = new QueryClient();

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

  const deleteItem = async (id: string) => {
    await deleteProduct(id);
    await loadProducts();
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const onBarCodeScanned = (barCode: BarCode) => {
    setBarCode(barCode);
    setScanProductVisible(false);
  };

  const toggleScanProduct = () => {
    setScanProductVisible(!scanProductVisible);
  };

  const addProduct = async (product: Product) => {
    await insertProduct(product);
    await loadProducts();
    setVisible(false);
  };

  const clearBarCode = () => {
    setBarCode(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <View style={styles.appContainer} onLayout={onLayoutRootView}>
          <Button title="Add New Product" onPress={toggleOverlay} />
          <Button title="Scan product" onPress={toggleScanProduct} />
          <Scanner
            visible={scanProductVisible}
            toggleOverlay={toggleScanProduct}
            onBarCodeScanned={onBarCodeScanned}
          />
          <AddProductModal
            visible={visible}
            toggleOverlay={toggleOverlay}
            onAddProduct={addProduct}
          />
          {barCode?.data && <QueryData barcode={barCode.data} removeBarCode={clearBarCode} />}
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
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    display: 'flex',
  },
  goalsContainer: {
    flex: 5,
  },
});
