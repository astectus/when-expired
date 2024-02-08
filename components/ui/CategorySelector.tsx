import { Chip, TextInput } from 'react-native-paper';
import { View } from 'react-native';
import { Category, NewCategory } from '../../models/Category';

export default function CategorySelector({
  categories,
  onAddCategory,
  onDeleteCategory,
}: {
  categories: NewCategory[];
  onAddCategory: (category: NewCategory) => void;
  onDeleteCategory: (category: NewCategory | Category) => void;
}) {
  return (
    <View>
      <View>
        {categories &&
          categories.length > 0 &&
          categories.map((category, index) => (
            <Chip
              icon="information"
              key={`${category.trimName}${index}`}
              onClose={() => onDeleteCategory(category)}
            >
              {category.name}
            </Chip>
          ))}
      </View>
      <TextInput
        mode="outlined"
        placeholder="Add Category"
        onChangeText={(category) =>
          onAddCategory({ name: category, trimName: category.trim().toLowerCase() })
        }
        right={<TextInput.Icon icon="plus" />}
      />
    </View>
  );
}
