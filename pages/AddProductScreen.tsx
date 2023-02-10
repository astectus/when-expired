import { Button, TextInput } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useState } from 'react';
import { isProduct } from '../utils/typeChecker';
import DatePicker from '../components/ui/DatePicker';
import AddImageContainer from '../components/ui/AddImageContainer';
import Product from '../models/Product';
import { insertProduct } from '../utils/database';

export default function AddProductScreen() {
  const [product, setProduct] = useState<Product | {}>({
    name: '',
    expirationDate: new Date(),
    price: '',
    photoUri: '',
    description: '',
  });

  const onSaveProduct = async () => {
    if (isProduct(product)) {
      await insertProduct(product);
    }
    setProduct({});
  };

  // @ts-ignore
  return (
    <View style={styles.container}>
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
            value={product.description}
            onChangeText={(description) => setProduct({ ...product, description })}
          />
          <DatePicker />
          <View style={styles.imageContainer}>
            <AddImageContainer onImagePicked={(photoUri) => setProduct({ ...product, photoUri })} />
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
});
