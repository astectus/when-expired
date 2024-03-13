import { Text } from 'react-native-paper';
import { View } from 'react-native';
import { useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import Product from '../models/Product';

export default function ProductScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: any;
}) {
  const { product } = route.params as { product: Product };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: product.name,
      headerTintColor: 'black',
    });
  }, [navigation]);

  return (
    <View>
      <Text>{product.name}</Text>
    </View>
  );
}
