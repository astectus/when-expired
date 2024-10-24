import { List, Avatar, IconButton, Text } from 'react-native-paper';
import { Animated, I18nManager, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Product from '../../models/Product';
import TimeLeft from './TimeLeft';

export default function ProductListItem({
  onDeleteItem,
  onSelectProduct,
  productItem,
}: {
  onDeleteItem: () => void;
  onSelectProduct: () => void;
  productItem: Product;
}) {
  let swipeRef: Swipeable;

  const avatar = () =>
    productItem.photoUri ? (
      <Avatar.Image
        source={{
          uri: productItem.photoUri,
        }}
        size={50}
      />
    ) : null;

  const deleteButton = () => (
    <View>
      <IconButton
        style={styles.deleteButton}
        icon={() => <MaterialCommunityIcons name="delete" size={24} />}
        onPress={onDeleteItem}
      />
    </View>
  );

const renderLeftActions = (
  _progress: Animated.AnimatedInterpolation<number>,
  dragX: Animated.AnimatedInterpolation<number>
) => {
  const trans = dragX.interpolate({
    inputRange: [0, 50, 100, 101],
    outputRange: [-20, 0, 0, 1],
    extrapolate: 'clamp',
  });
  return (
    // @ts-ignore
    // eslint-disable-next-line react/no-this-in-sfc
    <RectButton style={styles.leftAction} onPress={this.close}>
      <Animated.Text
        style={[
          styles.actionText,
          {
            transform: [{ translateX: trans }],
          },
        ]}>
        Archive
      </Animated.Text>
    </RectButton>
  );
};

const renderRightAction = (
  text: string,
  color: string,
  x: number,
  progress: Animated.AnimatedInterpolation<number>
) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });
  const pressHandler = () => {
    close();
    // eslint-disable-next-line no-alert
    window.alert(text);
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
      <RectButton
        style={[styles.rightAction, { backgroundColor: color }]}
        onPress={pressHandler}>
        <Text style={styles.actionText}>{text}</Text>
      </RectButton>
    </Animated.View>
  );
};

const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}>
      {renderRightAction('More', '#C8C7CD', 192, progress)}
      {renderRightAction('Flag', '#ffab00', 128, progress)}
      {renderRightAction('More', '#dd2c00', 64, progress)}
    </View>
  );

  const updateRef = (ref: Swipeable) => {
    swipeRef = ref;
  };
  const close = () => {
    swipeRef.close();
  };

  const timeLeft = productItem.expirationDate ? (
    <TimeLeft expirationDate={productItem.expirationDate} />
  ) : (
    <Text>No period selected</Text>
  );

  return (
    <Swipeable
      ref={updateRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        console.log(`Opening swipeable from the ${direction}`);
      }}
      onSwipeableClose={(direction) => {
        console.log(`Closing swipeable to the ${direction}`);
      }}>
      <List.Item
      title={productItem.name}
      onPress={onSelectProduct}
      description={timeLeft}
      left={avatar}
      right={deleteButton}
      style={styles.listItem}
    />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },

  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  deleteButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
