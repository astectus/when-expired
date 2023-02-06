import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Dialog } from 'react-native-paper';
import { BarCode } from '../../models/BarCode';

export default function Scanner({
  visible,
  toggleOverlay,
  onBarCodeScanned,
}: {
  visible: boolean;
  toggleOverlay: () => void;
  onBarCodeScanned: (barCode: BarCode) => void;
}) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      // @ts-ignore
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    onBarCodeScanned({ type, data });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Dialog visible={visible} onDismiss={toggleOverlay} style={styles.overlay}>
      <View style={styles.scannerContainer}>
        <Text>Scan product barcode</Text>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'white',
    display: 'flex',
    width: '90%',
    height: '90%',
  },
  scannerContainer: {
    height: '100%',
    width: '100%',
  },
});
