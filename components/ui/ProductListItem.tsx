import { List, Avatar, IconButton } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Product from '../../models/Product';
import TimeLeft from './TimeLeft';

export default function ProductListItem({
  onDeleteItem,
  onSelectProduct,
  productItem,
}: {
  onDeleteItem: () => void;
  onSelectProduct: () => void;
  productItem: Product;
}) {
  const avatar = () =>
    productItem.photoUri ? (
      <Avatar.Image
        source={{
          uri: productItem.photoUri,
        }}
        size={50}
      />
    ) : null;

  const deleteButton = () => (
    <View>
      <IconButton
        style={styles.deleteButton}
        icon={() => <MaterialCommunityIcons name="delete" size={24} />}
        onPress={onDeleteItem}
      />
    </View>
  );

  return (
    <List.Item
      title={productItem.name}
      onPress={onSelectProduct}
      description={<TimeLeft expirationDate={productItem.expirationDate} />}
      left={avatar}
      right={deleteButton}
      style={styles.listItem}
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },
  buttonContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
  },
  deleteButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
