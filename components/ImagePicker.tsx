import { View, Alert, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { launchCameraAsync, PermissionStatus, useCameraPermissions } from 'expo-image-picker';
import { useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { isImage } from '../utils/typeChecker';

export default function ImagePicker({
  onImagePicked,
}: {
  onImagePicked: (imageUri: string) => void;
}) {
  const [cameraPermission, askForCameraPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const verifyPermissions = async () => {
    if (cameraPermission?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await askForCameraPermission();

      return permissionResponse.granted;
    }

    if (cameraPermission?.status === PermissionStatus.DENIED) {
      Alert.alert('You need to grant camera permissions to use this app.');
      return false;
    }

    return true;
  };

  const takeImageHandler = async () => {
    const hasPermissions = await verifyPermissions();

    if (!hasPermissions) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 12],
      quality: 0.5,
    });

    if (isImage(image)) {
      setImageUri(image.uri);
      onImagePicked(image.uri);
    }
  };

  let imagePreview = <Text>No image picked yet.</Text>;

  if (imageUri) {
    imagePreview = <Image style={style.image} source={{ uri: imageUri }} />;
  }

  return (
    <View>
      <View style={style.imagePreview}>{imagePreview}</View>
      <Button onPress={takeImageHandler}>Take Image</Button>
    </View>
  );
}

const style = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 150,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
