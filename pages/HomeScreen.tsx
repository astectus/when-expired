import { FlatList, StyleSheet, View } from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';
import { useContext, useState } from 'react';
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
  const [fabOpen, setFabOpen] = useState(false);

  const deleteItem = async (id: string) => {
    await removeProduct(id);
  };

  const goToAddProductScreen = () => {
    navigate('Select method');
  };

  return (
    <Provider>
      <NoHeaderScreen>
        <View style={styles.container}>
          <View style={styles.listContainer}>
            <FlatList
              data={products}
              renderItem={({ item }) => (
                <ProductListItem
                  productItem={item}
                  onSelectProduct={() => navigate('Product', { productJSON: JSON.stringify(item) })}
                  onDeleteItem={() => deleteItem(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              alwaysBounceVertical={false}
            />
          </View>
        </View>
      </NoHeaderScreen>
      <Portal>
          <FAB.Group
            visible={true}
            open={fabOpen}
            icon={fabOpen ? 'close' : 'plus'}
            actions={[
              {
                icon: 'plus',
                label: 'Add new product',
                onPress: goToAddProductScreen,
              },
              {
                icon: 'tag',
                label: 'Add category',
                onPress: () => console.log('Add category pressed'),
              },
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
            style={styles.fab}
          />
        </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
  },
  fab: {
    position: 'absolute',
  },
});
