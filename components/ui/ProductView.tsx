import { TextInput } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import {  useState } from 'react';
import DatePicker from './DatePicker';
import AddImageContainer from './AddImageContainer';
import Product from '../../models/Product';
import CategorySelector from './CategorySelector';
import { Category, NewCategory } from '../../models/Category';

export default function ProductView({product, setProduct}: {product: Product, setProduct: (product: Product) => void}) {
  const [tempCategoriesNames, setTempCategoriesNames] = useState<Array<NewCategory | Category>>([]);

  const onAddCategory = (category: NewCategory | Category) => {
    setTempCategoriesNames((prevState) => [...prevState, category]);
  };

  const onDeleteCategory = (newCategory: NewCategory | Category) => {
    setTempCategoriesNames((prevState) =>
      prevState.filter((category) => category.trimName !== newCategory.trimName)
    );
  };

  // @ts-ignore
  return (
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
      <DatePicker
        defaultDate={product.expirationDate}
        onChangeDate={(expirationDate) => setProduct({ ...product, expirationDate })}
      />
      <CategorySelector
        categories={tempCategoriesNames}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
      />
      <View style={styles.imageContainer}>
        <AddImageContainer
          defaultImageUri={product.photoUri}
          onImagePicked={(photoUri) => setProduct({ ...product, photoUri })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    margin: 5,
    height: 300,
  },
});
