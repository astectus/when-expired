import { Text, Image, StyleSheet, ScrollView } from 'react-native';
import { View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Product from '../models/Product';
import { Category } from '../models/Category';

export default function ProductScreen({
                                        route,
                                      }: {
  navigation: NavigationProp<any>;
  route: any;
}) {
  const { product } = route.params as { product: Product };

  return (
    <ScrollView>
      <View style={styles.container}>
        {product.photoUri && <Image source={{ uri: product.photoUri }} style={styles.image} />}
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <View style={styles.categoriesContainer}>
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
    borderRadius: 100,
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
    fontSize: 14,
    margin: 4,
  },
});