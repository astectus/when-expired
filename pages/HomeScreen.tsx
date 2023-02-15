import { FlatList, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useContext } from 'react';
import { NavigationProp } from '@react-navigation/native';
import ProductListItem from '../components/ui/ProductListItem';
import NoHeaderScreen from '../components/layout/NoHeaderScreen';
import { ProductsContext } from '../state/context/products-context';

export default function HomeScreen({
  navigation: { navigate },
}: {
  navigation: NavigationProp<any>;
}) {
  const { products, removeProduct } = useContext(ProductsContext);

  const deleteItem = async (id: string) => {
    await removeProduct(id);
  };

  const goToAddProductScreen = () => {
    navigate('Select method');
  };

  return (
    <NoHeaderScreen>
      <View>
        <Button onPress={goToAddProductScreen}>Add New Product</Button>
        <View>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <ProductListItem
                productItem={item}
                // eslint-disable-next-line react/jsx-no-bind
                onDeleteItem={deleteItem}
              />
            )}
            keyExtractor={(item) => item.id}
            alwaysBounceVertical={false}
          />
        </View>
      </View>
    </NoHeaderScreen>
  );
}
