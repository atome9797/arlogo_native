import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import {useLogoContext} from '../../../../screens/customLogo/hooks/useLogoContext';
// import {useExampleContext} from '../../hooks/useExampleContext';
import {SliderTypes} from './types';

const Slider = ({onEnded}: SliderTypes) => {
  const {sharedSliderValue} = useLogoContext();
  // console.log('sharedSliderValue:::::::', sharedSliderValue);
  const slideHandler = useAnimatedGestureHandler({
    onStart: (_ev: any, ctx: any) => {
      ctx.startX = sharedSliderValue.value;
    },
    onActive: (_ev, ctx) => {
      // console.log(ctx.startX + _ev.translationX, ctx.startX, _ev.translationX);
      sharedSliderValue.value = ctx.startX + _ev.translationX;
    },
    onEnd: () => {
      runOnJS(onEnded)();
    },
  });
  const animatedSliderStyle = useAnimatedStyle(
    () => ({
      transform: [{translateX: sharedSliderValue.value}],
    }),
    [],
  );

  return (
    <View style={sliderStyle.sliderContainer}>
      <View style={sliderStyle.sliderInactive}>
        <PanGestureHandler onGestureEvent={slideHandler}>
          <Animated.View
            style={[
              animatedSliderStyle,
              sliderStyle.sliderDefault,
            ]}></Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

const sliderStyle = StyleSheet.create({
  sliderDefault: {
    backgroundColor: '#fff',
    width: 20,
    height: 20,
    borderRadius: 20,
    position: 'absolute',
    bottom: -8,
  },
  sliderInactive: {
    height: 3,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#5794ff',
    display: 'flex',
  },
  sliderContainer: {
    height: '5%',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    display: 'flex',
  },
});
export default Slider;
