import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider as PaperProvider, DefaultTheme, Button } from 'react-native-paper';

import AddProductModal from './components/AddProductModal';
import ProductListItem from './components/ProductListItem';
import Product from './models/Product';
import { init, insertProduct, fetchProducts, deleteProduct } from './utils/database';
import Scanner from './components/Scanner';
import { BarCode } from './models/BarCode';
import QueryData from './components/QueryData';

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
      <PaperProvider theme={theme}>
        <View style={styles.appContainer} onLayout={onLayoutRootView}>
          <Button onPress={toggleOverlay}>Add New Product</Button>
          <Button onPress={toggleScanProduct}>Scan product</Button>
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
      </PaperProvider>
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
