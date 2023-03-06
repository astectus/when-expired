import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Product from '../../models/Product';
import { themeColors } from '../../constants/themeColors';

export function FavoriteIcon({ product }: { product: Product }) {
  const iconType = product.isFavorite ? 'star' : 'star-outline';
  return <MaterialCommunityIcons name={iconType} color={themeColors.favorite} size={26} />;
}
