import { FlatList, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Scanner from '../components/ui/Scanner';
import AddProductModal from '../components/ui/AddProductModal';
import QueryData from '../components/ui/QueryData';
import ProductListItem from '../components/ui/ProductListItem';
import { deleteProduct, fetchProducts, insertProduct } from '../utils/database';
import { BarCode } from '../models/BarCode';
import Product from '../models/Product';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState(false);
  const [scanProductVisible, setScanProductVisible] = useState(false);
  const [barCode, setBarCode] = useState<BarCode | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const products = await fetchProducts();
    setProducts(products);
  };

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
    <View>
      <Button onPress={toggleOverlay}>Add New Product</Button>
      <Button onPress={toggleScanProduct}>Scan product</Button>
      <Scanner
        visible={scanProductVisible}
        toggleOverlay={toggleScanProduct}
        onBarCodeScanned={onBarCodeScanned}
      />
      <AddProductModal visible={visible} toggleOverlay={toggleOverlay} onAddProduct={addProduct} />
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
  );
}

const styles = StyleSheet.create({
  goalsContainer: {
    flex: 5,
  },
});
