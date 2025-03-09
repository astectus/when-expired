import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Product from '../../models/Product';
import { lightColors } from '../../constants/themeColors';

export function FavoriteIcon({ product }: { product: Product }) {
  const iconType = product.isFavorite ? 'star' : 'star-outline';
  return <MaterialCommunityIcons name={iconType} color={lightColors.favorite} size={26} />;
}
