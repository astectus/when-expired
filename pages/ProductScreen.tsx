import { Text, Image, StyleSheet, ScrollView , View } from 'react-native';

import { Chip } from 'react-native-paper';
import { useCallback, useContext } from 'react';
import Product from '../models/Product';
import { ProductsContext } from '../state/context/products-context';

export default function ProductScreen(
  { route }: {
  route: any;
}) {
  const { productJSON } = route.params as { productJSON: string };
  const product: Product = JSON.parse(productJSON);
  const { categories } = useContext(ProductsContext);
  console.log(product);
  console.log(categories);

  const Categories = useCallback(() => {
    const productCategories = categories.filter(category => product.categoryIds?.includes(category.id.toString()))
    console.log(productCategories);
    return productCategories.map(category => <Chip
      style={styles.category}
      key={`${category.trimName}`}>
      {category.name}
    </Chip>)
  }, [categories, product]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {product.photoUri && <Image source={{ uri: product.photoUri }} style={styles.image} />}
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <View style={styles.categoriesContainer}>
          <Categories />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  category: {
    margin: 5,
  },
});