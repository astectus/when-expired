import { View, Alert, StyleSheet, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { launchCameraAsync, PermissionStatus, useCameraPermissions } from 'expo-image-picker';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { isImage } from '../../utils/typeChecker';
import { themeColors } from '../../constants/themeColors';

export default function AddImageContainer({
  onImagePicked,
  defaultImageUri,
}: {
  onImagePicked: (imageUri: string) => void;
  defaultImageUri?: string;
}) {
  const [cameraPermission, askForCameraPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (defaultImageUri) {
      setImageUri(defaultImageUri);
    }
  }, [defaultImageUri]);

  const verifyPermissions = async () => {
    if (!cameraPermission?.granted) {
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

    setImage(image);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  const setImage = (image: any) => {
    console.log(image);
    if (isImage(image)) {
      console.log(image);
      setImageUri(image.assets[0].uri);
      onImagePicked(image.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <View style={styles.imagePreview}>
          <Image style={styles.image} source={{ uri: imageUri }} />
        </View>
      )}
      <View style={styles.actions}>
        <Button onPress={takeImageHandler}>Take image</Button>
        <Text>Or</Text>
        <Button onPress={pickImage}>Pick from folder</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: themeColors.tertiaryContainer,
    padding: 5,
    borderRadius: 20,
    height: '100%',
    justifyContent: 'center',
  },
  imagePreview: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginTop: 10,
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: '20%',
    width: '100%',
  },
});
