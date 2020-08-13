import React from 'react';
import {StyleSheet, Text} from 'react-native';
import ModalDatePicker from 'react-native-datepicker-modal';
const DatePicker = ({style, ...props}) => (
  <ModalDatePicker
    style={[styles.container, style]}
    renderDate={({year, month, day, date}) => {
      if (!date) {
        return (
          <Text style={[styles.text, styles.placeholderText]}>
            Date of birth
          </Text>
        );
      }

      const dateStr = `${day}-${month}-${year}`;
      return <Text style={styles.text}>{dateStr}</Text>;
    }}
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomColor: '#5b5959',
    borderBottomWidth: 1,
    marginVertical: 1,
    marginHorizontal: 1,
    justifyContent: 'center',
    borderRadius: 2,
    height: 50,
  },
  placeholderText: {
    color: '#5b5959',
  },
  text: {
    width: '100%',
    paddingHorizontal: 1,
    paddingVertical: 1,
    fontFamily: 'Montserrat',
    fontSize: 20,
    color: 'black',
  },
});

export default DatePicker;
