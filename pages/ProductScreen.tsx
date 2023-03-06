import { Text } from 'react-native-paper';
import { View } from 'react-native';
import { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, Route } from '@react-navigation/native';
import Product from '../models/Product';

export default function ProductScreen({
  navigation,
  route,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: Route<string, { product: Product }>;
}) {
  const { product } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: product.name,
    });
  }, [navigation]);

  return (
    <View>
      <Text>Product name</Text>
    </View>
  );
}
