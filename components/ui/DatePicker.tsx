import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import TimeLeft from './TimeLeft';

export default function DatePicker({ defaultDate }: { defaultDate: Date | undefined }) {
  const [date, setDate] = useState<Date | undefined>(defaultDate || undefined);

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate instanceof Date) {
      setDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange,
      mode: 'date',
      is24Hour: true,
      minimumDate: new Date(),
    });
  };

  const timeLeft = date ? (
    <TimeLeft expirationDate={date} onPress={showDatePicker} />
  ) : (
    <Text>No period selected</Text>
  );

  return (
    <View style={styles.datePicker}>
      {timeLeft}
      <IconButton icon="calendar" onPress={showDatePicker} />
    </View>
  );
}

const styles = StyleSheet.create({
  datePicker: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    paddingLeft: 15,
  },
});
