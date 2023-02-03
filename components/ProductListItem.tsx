import { List, Avatar, Button } from 'react-native-paper';
import Product from '../models/Product';

export default function ProductListItem({
  onDeleteItem,
  productItem,
}: {
  onDeleteItem: (id: string) => void;
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

  const button = () => <Button onPress={() => onDeleteItem(productItem.id)}> Delete Item</Button>;

  return (
    <List.Item
      title={productItem.name}
      description={productItem.description}
      left={avatar}
      right={button}
    />
  );
}
