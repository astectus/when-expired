import { ScrollView, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Dialog, Text, Button, TextInput, Portal } from 'react-native-paper';
import Product from '../../models/Product';
import ImagePicker from './ImagePicker';
import DatePicker from './DatePicker';
import { isProduct } from '../../utils/typeChecker';

export default function AddProductModal({
  visible,
  toggleOverlay,
  onAddProduct,
}: {
  visible: boolean;
  toggleOverlay: () => void;
  onAddProduct: (product: Product) => void;
}) {
  const [product, setProduct] = useState<Product | {}>({
    name: '',
    expirationDate: '',
    price: '',
    photoUri: '',
    description: '',
  });

  const onSaveProduct = () => {
    if (isProduct(product)) {
      onAddProduct(product);
    }
    setProduct({});
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={toggleOverlay}>
        <Dialog.Title>
          <Text style={styles.textPrimary}>Add new product manually</Text>
        </Dialog.Title>
        <Dialog.Content>
          <ScrollView style={styles.modalForm}>
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
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={styles.modalSubmitButton}
            icon="calendar"
            onPress={onSaveProduct}
            mode="contained"
          >
            Add product
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
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
