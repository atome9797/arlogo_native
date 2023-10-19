import React from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet} from 'react-native';

const LoadingScreen = () => {
  return (
    <LottieView
      source={require('../../asset/json/loading.json')}
      autoPlay
      loop
      style={style.container}
    />
  );
};
export default LoadingScreen;
const style = StyleSheet.create({
  container: {
    zIndex: 10,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
