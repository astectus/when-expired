import { Button, TextInput, IconButton } from 'react-native-paper';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isProduct } from '../utils/typeChecker';
import DatePicker from '../components/ui/DatePicker';
import AddImageContainer from '../components/ui/AddImageContainer';
import Product from '../models/Product';
import { ProductsContext } from '../state/context/products-context';
import { getProductByBarcode } from '../api/api';

export default function AddProductScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: any;
}) {
  const context = useContext(ProductsContext);
  const [product, setProduct] = useState<Product | {}>({
    name: '',
    expirationDate: new Date(),
    price: '',
    photoUri: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getProduct(barcode: string) {
      const product = await getProductByBarcode(barcode);
      if (product) {
        setProduct(product);
      } else {
        Alert.alert('Product not found', 'Please add product manually');
      }
      setIsLoading(false);
    }
    if (route?.params?.barcode) {
      setIsLoading(true);
      getProduct(route?.params.barcode);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.backButtonContainer}>
          <IconButton
            style={styles.backButton}
            icon={() => <MaterialCommunityIcons name="arrow-left" size={24} />}
            onPress={() => navigation.navigate('Select method')}
          />
        </View>
      ),
    });
  }, [navigation]);

  const onSaveProduct = async () => {
    if (isProduct(product)) {
      await context.addProduct(product);
    }
    // redirect to home
    setProduct({});
    navigation.navigate('Home');
  };

  // @ts-ignore
  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} textContent="Loading..." textStyle={styles.spinnerTextStyle} />
      {isProduct(product) && (
        <ScrollView>
          <TextInput
            mode="outlined"
            placeholder="Product name"
            value={product.name}
            onChangeText={(name) => setProduct({ ...product, name })}
          />
          <TextInput
            mode="outlined"
            placeholder="Product price"
            value={product.price}
            keyboardType="numeric"
            onChangeText={(price) => setProduct({ ...product, price })}
          />
          <TextInput
            mode="outlined"
            placeholder="Product description"
            multiline
            numberOfLines={3}
            value={product.description}
            onChangeText={(description) => setProduct({ ...product, description })}
          />
          <DatePicker defaultDate={product.expirationDate} />
          <View style={styles.imageContainer}>
            <AddImageContainer
              defaultImageUri={product.photoUri}
              onImagePicked={(photoUri) => setProduct({ ...product, photoUri })}
            />
          </View>
        </ScrollView>
      )}
      <Button
        style={styles.addProductButton}
        icon="calendar"
        onPress={onSaveProduct}
        mode="contained"
      >
        Add product
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    height: '100%',
  },
  imageContainer: {
    margin: 5,
    height: 300,
  },
  addProductButton: {
    margin: 5,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  backButtonContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backButton: {
    marginLeft: -10,
  },
});
