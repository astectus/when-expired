import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Button, Icon, Text } from '@rneui/base';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

export default function DatePicker() {
  const [date, setDate] = useState(new Date());

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate instanceof Date) {
      setDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: 'date',
      is24Hour: true,
    });
  };

  return (
    <View style={styles.datePicker}>
      <Text onPress={showDatePicker} style={styles.datePickerValue}>
        {new Date(date).toDateString()}
      </Text>
      <Button radius="sm" type="solid" onPress={showDatePicker}>
        <Icon name="calendar" type="font-awesome" color="white" />
      </Button>
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
  },
  datePickerValue: {
    fontSize: 18,
    marginLeft: 10,
    flexGrow: 1,
  },
});
