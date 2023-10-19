import React, {useRef} from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet} from 'react-native';

const LottieSplashScreen = ({isLoadingSet}) => {
  const lottieRef = useRef(null);
  return (
    <LottieView
      ref={lottieRef}
      source={require('../../asset/json/splashscreen.json')}
      autoPlay
      resizeMode="cover"
      loop={false}
      onAnimationFinish={isCancelled => {
        console.log('isCancelled:', isCancelled);
        isLoadingSet(true);
      }}
      style={style.container}
    />
  );
};

export default LottieSplashScreen;
const style = StyleSheet.create({
  container: {
    zIndex: 10,
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0)',
  },
});
