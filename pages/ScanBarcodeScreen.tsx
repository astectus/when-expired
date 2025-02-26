import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';

export default function ScanBarcodeScreen({ navigation: { navigate } }: { navigation: any }) {
  const [type, setType] = useState<CameraType>('back');;
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>grant permission</Button>
      </View>
    );
  }


  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (data === null) return;
    navigate('Add product', { barcode: data });
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={type} onBarcodeScanned={handleBarCodeScanned} barcodeScannerSettings={{
        barcodeTypes:
        [
        'aztec',
        'ean13',
        'ean8',
        'qr',
        'pdf417',
        'upc_e',
        'datamatrix',
        'code39',
        'code93',
        'itf14',
        'codabar',
        'code128',
        'upc_a'
        ]
      }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
