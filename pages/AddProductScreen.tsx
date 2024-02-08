import { Button, TextInput } from 'react-native-paper';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { isProduct } from '../utils/typeChecker';
import DatePicker from '../components/ui/DatePicker';
import AddImageContainer from '../components/ui/AddImageContainer';
import { NewProduct } from '../models/Product';
import { ProductsContext } from '../state/context/products-context';
import { getProductByBarcode } from '../api/api';
import CategorySelector from '../components/ui/CategorySelector';
import { Category, NewCategory } from '../models/Category';

export default function AddProductScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: any;
}) {
  const { addProduct, addCategories } = useContext(ProductsContext);
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
});
