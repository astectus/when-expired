import { Overlay, Text, Button, Icon, Input } from '@rneui/base';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import Product from '../models/Product';
import ImagePicker from './ImagePicker';
import DatePicker from './DatePicker';
import { isProduct } from '../utils/typeChecker';

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
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.textPrimary}>Add new product manually</Text>
        <ScrollView style={styles.modalForm}>
          {isProduct(product) && (
            <View style={styles.modalContainer}>
              <Input
                placeholder="Product name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.nativeEvent.text })}
              />
              <Input
                placeholder="Product price"
                value={product.price}
                keyboardType="numeric"
                onChange={(e) => setProduct({ ...product, price: e.nativeEvent.text })}
              />
              <Input
                placeholder="Product description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.nativeEvent.text })}
              />
              <DatePicker />
              <ImagePicker onImagePicked={(photoUri) => setProduct({ ...product, photoUri })} />
            </View>
          )}
        </ScrollView>
        <Button
          style={styles.modalSubmitButton}
          icon={
            <Icon
              name="save"
              type="font-awesome"
              color="white"
              size={25}
              iconStyle={{ marginRight: 10 }}
            />
          }
          title="Add product"
          onPress={onSaveProduct}
        />
      </View>
    </Overlay>
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
  overlay: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    display: 'flex',
  },
  modalSubmitButton: {
    alignSelf: 'flex-end',
  },
});
