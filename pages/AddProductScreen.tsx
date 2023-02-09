import { Button, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { DatePickerInput } from 'react-native-paper-dates';
import { isProduct } from '../utils/typeChecker';
import DatePicker from '../components/ui/DatePicker';
import ImagePicker from '../components/ui/ImagePicker';
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
    <View style={styles.modalForm}>
      {isProduct(product) && (
        <View style={styles.modalContainer}>
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
          <ImagePicker onImagePicked={(photoUri) => setProduct({ ...product, photoUri })} />
        </View>
      )}
      <Button
        style={styles.modalSubmitButton}
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
  modalContainer: {
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalForm: {
    marginBottom: 20,
  },
  textPrimary: {
    textAlign: 'center',
    fontSize: 20,
  },
  modalSubmitButton: {
    alignSelf: 'flex-end',
  },
});
