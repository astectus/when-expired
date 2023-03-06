import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ScanBarcodeScreen({ navigation: { navigate } }: { navigation: any }) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      // @ts-ignore
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (data === null) return;
    navigate('Add product', { barcode: data });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.scannerContainer}>
      <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  scannerContainer: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
});
