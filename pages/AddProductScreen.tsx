import { Button, TextInput } from 'react-native-paper';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { isProduct } from '../utils/typeChecker';
import DatePicker from '../components/ui/DatePicker';
import AddImageContainer from '../components/ui/AddImageContainer';
import Product from '../models/Product';
import { ProductsContext } from '../state/context/products-context';
import { getProductByBarcode } from '../api/api';
import { AnimatedAppLoader } from '../components/ui/AnimatedAppLoader';
import Constants from 'expo-constants';

SplashScreen.preventAutoHideAsync();

export default function AddProductScreen({
  route,
}: {
  route: RouteProp<{ params: { barcode: string | undefined } }>;
}) {
  const { barcode } = route.params;
  const context = useContext(ProductsContext);
  const [product, setProduct] = useState<Product | {}>({
    name: '',
    expirationDate: new Date(),
    price: '',
    photoUri: '',
    description: '',
  });

  const [screenIsReady, setScreenIsReady] = useState(false);

  useEffect(() => {
    async function getProduct(barcode: string) {
      const product = await getProductByBarcode(barcode);
      if (product) {
        setProduct(product);
      } else {
        Alert.alert('Product not found', 'Please add product manually');
      }
      setScreenIsReady(true);
    }
    if (barcode) {
      getProduct(barcode);
    } else {
      setScreenIsReady(true);
    }
  }, []);

  const onSaveProduct = async () => {
    if (isProduct(product)) {
      await context.addProduct(product);
    }
    // redirect to home
    setProduct({});
  };

  const onLayoutRootView = useCallback(async () => {
    if (screenIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [screenIsReady]);

  if (!screenIsReady) {
    return null;
  }

  // @ts-ignore
  return (
    <AnimatedAppLoader image={{ uri: Constants.manifest.splash.image }}>
      <View style={styles.container} onLayout={onLayoutRootView}>
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
    </AnimatedAppLoader>
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
});
