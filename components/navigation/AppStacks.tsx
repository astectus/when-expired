import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectMethodScreen from '../../pages/SelectMethodScreen';
import ScanBarcodeScreen from '../../pages/ScanBarcodeScreen';
import AddProductScreen from '../../pages/AddProductScreen';
import HomeTabs from './HomeTabs';
import ProductScreen from '../../pages/ProductScreen';
import MainNavigationBar from '../ui/MainNavigationBar';

const Stack = createNativeStackNavigator();

export default function AppStacks() {
  return (
    <Stack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        header: (props) => <MainNavigationBar {...props} />,
      }}
    >
      <Stack.Screen name="Select method" component={SelectMethodScreen} />
      <Stack.Screen name="Add product" component={AddProductScreen} />
      <Stack.Screen name="Scan barcode" component={ScanBarcodeScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
