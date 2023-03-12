import { Chip, TextInput } from 'react-native-paper';
import { View } from 'react-native';

export default function CategorySelector({
  categories,
  onAddCategory,
  onDeleteCategory,
}: {
  categories: string[];
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
}) {
  return (
    <View>
      <View>
        {categories &&
          categories.length > 0 &&
          categories.map((category) => (
            <Chip icon="information" onClose={() => onDeleteCategory(category)}>
              {category}
            </Chip>
          ))}
      </View>
      <TextInput
        mode="outlined"
        placeholder="Add Category"
        onChangeText={onAddCategory}
        right={<TextInput.Icon icon="plus" />}
      />
    </View>
  );
}
