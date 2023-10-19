import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {navTheme} from '../navigation';
import ScreenContainer from './ScreenContainer';
// import {ActivityIndicator} from 'react-native-paper';

const Spinner = () => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ActivityIndicator size={'large'} />
      </View>
    </ScreenContainer>
  );
};
export default Spinner;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    // position: 'absolute',
    // left: 0,
    // top: 0,
  },
});
