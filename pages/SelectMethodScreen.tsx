import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Button, Text } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import { AddProductMethod } from '../models/AddProductMethod';

export default function SelectMethodScreen({
  navigation: { navigate },
}: {
  navigation: NavigationProp<any>;
}) {
  const onMethodSelected = (method: AddProductMethod) => {
    const screens = {
      manual: 'Add product',
      scan: 'Scan barcode',
    };

    navigate(screens[method]);
  };
  return (
    <View style={styles.container}>
      <Button onPress={() => onMethodSelected('manual')}>Manual</Button>
      <Text>-----Or------</Text>
      <Button onPress={() => onMethodSelected('scan')}>Scan Barcode</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
});
