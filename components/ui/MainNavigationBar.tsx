import { Appbar } from 'react-native-paper';
import { ParamListBase, Route } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { isProduct, isString } from '../../utils/typeChecker';
import Product from '../../models/Product';
import { FavoriteIcon } from './FavoriteIcon';
import { ProductsContext } from '../../state/context/products-context';

const customBackRoutes: Record<string, string> = {
  'Add product': 'Select method',
};

export default function MainNavigationBar({
  navigation,
  options,
  route,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
  options: NativeStackNavigationOptions;
  route: Route<string, any>;
}) {
  const { updateProduct } = useContext(ProductsContext);

  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    if (route.name === 'Product' && isProduct(route.params?.product)) {
      setProduct(route.params?.product);
    }
  }, []);

  const toggleFavorite = async (product: Product) => {
    const updatedProduct = { ...product, isFavorite: !product.isFavorite };
    await updateProduct(updatedProduct);
    setProduct(updatedProduct);
  };

  function Title() {
    if (product) {
      return <Appbar.Content title={product.name} />
    } 
      return <Appbar.Content title={title} />
    
  }

  const title = isString(options?.headerTitle) || route.name;
  const backCallback = customBackRoutes[route.name]
    ? () => navigation.navigate(customBackRoutes[route.name])
    : navigation.goBack;
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={backCallback} />
      <Title/>
      {product && (
        <Appbar.Action
          icon={() => <FavoriteIcon product={product} />}
          onPress={() => toggleFavorite(product)}
        />
      )}
    </Appbar.Header>
  );
}
