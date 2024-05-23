import { Text } from 'react-native-paper';
import { View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Product from '../models/Product';

export default function ProductScreen({
  route,
}: {
  navigation: NavigationProp<any>;
  route: any;
}) {
  const { product } = route.params as { product: Product };

  return (
    <View>
      <Text>{product.name}</Text>
    </View>
  );
}
