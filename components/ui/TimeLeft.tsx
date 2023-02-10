import { Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { differenceInDays } from '../../utils/differenceBetweenDate';

export default function TimeLeft({
  expirationDate,
  onPress,
}: {
  expirationDate: Date;
  onPress: () => void;
}) {
  const daysLeft = useMemo(() => {
    const days = differenceInDays(new Date(), expirationDate);

    const getLongPeriodText = (days: number) => {
      if (days >= 60) {
        return `${Math.floor(days / 30)} months left`;
      }
      if (days >= 30) {
        return 'One month left';
      }
      if (days >= 14) {
        return `${Math.floor(days / 7)} weeks left`;
      }
      if (days >= 7) {
        return 'One week left';
      }

      if (days === 1) {
        return 'One day left';
      }

      if (days <= 0) {
        return 'Expires today';
      }

      return `${days} days left`;
    };

    return getLongPeriodText(days);
  }, [expirationDate]);

  return (
    <Text style={styles.datePickerValue} onPress={onPress}>
      {daysLeft}
    </Text>
  );
}

const styles = StyleSheet.create({
  datePickerValue: {
    fontSize: 18,
    marginLeft: 10,
    flexGrow: 1,
  },
});
