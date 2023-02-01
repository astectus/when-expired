import { ListItem, Avatar, Button } from '@rneui/base';
import Product from '../models/Product';

export default function ProductListItem({
  onDeleteItem,
  productItem,
}: {
  onDeleteItem: (id: string) => void;
  productItem: Product;
}) {
  const avatar = productItem.photoUri ? (
    <Avatar
      source={{
        uri: productItem.photoUri,
      }}
      size="large"
      title="LW"
      onPress={() => console.log('Works!')}
    />
  ) : null;

  return (
    <ListItem bottomDivider>
      {avatar}
      <ListItem.Content>
        <ListItem.Title>{productItem.name}</ListItem.Title>
        <ListItem.Subtitle>{productItem.description}</ListItem.Subtitle>
        <Button onPress={() => onDeleteItem(productItem.id)}> Delete Item</Button>
      </ListItem.Content>
    </ListItem>
  );
}
