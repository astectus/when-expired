import { Button } from 'react-native-paper';
import { StyleSheet, View, Alert } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { isProduct } from '../utils/typeChecker';
import { NewProduct } from '../models/Product';
import { ProductsContext } from '../state/context/products-context';
import { getProductByBarcode } from '../api/api';
import { Category, NewCategory } from '../models/Category';
import ProductView from '../components/ui/ProductView';

export default function AddProductScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: any;
}) {
  const { addProduct } = useContext(ProductsContext);
  const [product, setProduct] = useState<NewProduct | {}>({
    name: '',
    expirationDate: new Date(),
    price: '',
    photoUri: '',
    description: '',
  });
  const [tempCategoriesNames, setTempCategoriesNames] = useState<Array<NewCategory | Category>>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProduct = async (barcode: string) => {
      const data = await getProductByBarcode(barcode);
      if (data?.product) {
        setProduct(data?.product);
        setTempCategoriesNames(data.categories);
      } else {
        Alert.alert('Product not found', 'Please add product manually');
      }
      setIsLoading(false);
    };
    if (route?.params?.barcode) {
      setIsLoading(true);
      getProduct(route?.params.barcode);
    } else {
      setIsLoading(false);
    }
  }, []);

  const onSaveProduct = async () => {
    if (isProduct(product)) {
      await addProduct(product, tempCategoriesNames);
    }
    // redirect to home
    navigation.navigate('Home');
  };

  // @ts-ignore
  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} textContent="Loading..." textStyle={styles.spinnerTextStyle} />
      {isProduct(product) && (
        <View style={styles.productViewContainer}>
          <ProductView product={product} setProduct={setProduct} />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.addProductButton}
          icon="calendar"
          onPress={onSaveProduct}
          mode="contained"
        >
          Add product
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    height: '100%',
  },
  productViewContainer: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  addProductButton: {
    margin: 5,
    paddingVertical: 5,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
