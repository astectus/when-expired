import { FlatList, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import ProductListItem from '../components/ui/ProductListItem';
import { deleteProduct, fetchProducts } from '../utils/database';
import { BarCode } from '../models/BarCode';
import Product from '../models/Product';
import NoHeaderScreen from '../components/layout/NoHeaderScreen';

export default function HomeScreen({
  navigation: { navigate },
}: {
  navigation: NavigationProp<any>;
}) {
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

  const goToAddProductScreen = () => {
    navigate('Select method');
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

  const clearBarCode = () => {
    setBarCode(null);
  };

  return (
    <NoHeaderScreen>
      <View>
        <Button onPress={goToAddProductScreen}>Add New Product</Button>
        <View>
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
    </NoHeaderScreen>
  );
}
