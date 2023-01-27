import { Overlay, Text, Button, Icon, Input } from '@rneui/base';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import Product from '../models/Product';

export default function AddProductModal({
    visible,
    toggleOverlay,
    onAddProduct,
}: {
    visible: boolean;
    toggleOverlay: () => void;
    onAddProduct: (product: Product) => void;
}) {
    const [product, setProduct] = useState<Product>({
        id: Math.random().toString(),
        name: '',
        expirationDate: '',
        price: '',
        photoUri: '',
        description: '',
    });
    const onSaveProduct = () => {
        onAddProduct(product);
    };

    return (
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlay}>
            <Text style={styles.textPrimary}>Add new product manually</Text>
            <View>
                <Input
                    placeholder="Product name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.nativeEvent.text })}
                />
                <Input
                    placeholder="Product expiration date"
                    value={product.expirationDate}
                    keyboardType="numeric"
                    onChange={(e) => setProduct({ ...product, expirationDate: e.nativeEvent.text })}
                />
                <Input
                    placeholder="Product price"
                    value={product.price}
                    keyboardType="numeric"
                    onChange={(e) => setProduct({ ...product, price: e.nativeEvent.text })}
                />
                <Input
                    placeholder="Product description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.nativeEvent.text })}
                />
            </View>
            <Button
                icon={
                    <Icon
                        name="save"
                        type="font-awesome"
                        color="white"
                        size={25}
                        iconStyle={{ marginRight: 10 }}
                    />
                }
                title="Add product"
                onPress={onSaveProduct}
            />
        </Overlay>
    );
}

const styles = StyleSheet.create({
    textPrimary: {
        textAlign: 'center',
        fontSize: 20,
    },
    overlay: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        display: 'flex',
    },
});
