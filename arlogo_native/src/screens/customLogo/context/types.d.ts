import Animated from 'react-native-reanimated';

export interface LogoContextTypes {
  key?: Animated.SharedValue<number>;
  sharedSliderValue?: Animated.SharedValue<number>;
  fontSize?: Animated.SharedValue<number>;
  fontSizeList?: Animated.SharedValue<number[]>;
  shapeWidth: Animated.SharedValue<number>;
  shapeHeight: Animated.SharedValue<number>;
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  angle: Animated.SharedValue<number>;
  absMarginY?: Animated.SharedValue<number>;
  selected: Animated.SharedValue<boolean>;
  // opacityValue: Animated.SharedValue<number>;
}
