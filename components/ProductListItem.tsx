import { ListItem, Avatar, Button } from '@rneui/base';
import Product from '../models/Product';

export default function ProductListItem({
  onDeleteItem,
  productItem,
}: {
  onDeleteItem: (id: string) => void;
  productItem: Product;
}) {
  return (
    <ListItem bottomDivider>
      <Avatar rounded />
      <ListItem.Content>
        <ListItem.Title>{productItem.name}</ListItem.Title>
        <ListItem.Subtitle>{productItem.description}</ListItem.Subtitle>
        <Button onPress={() => onDeleteItem(productItem.id)}> Delete Ite</Button>
      </ListItem.Content>
    </ListItem>
  );
}
