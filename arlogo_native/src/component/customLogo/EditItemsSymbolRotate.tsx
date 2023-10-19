import React from 'react';
import Animated, {
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {Image, Keyboard} from 'react-native';
import {useLogoContext} from '../../screens/customLogo/hooks/useLogoContext';
import {getCenters, getEventAbsolute, rotation} from '../../utils/libs';
import images from '../../utils/images';
import styles from '../../utils/styles';
import FImage from '../common/fimage';

const EditItemsSymbolRotate = ({measurePageY, editObjValues}: any) => {
  const {shapeWidth, shapeHeight, angle, x, y} = useLogoContext();

  const handleResizers = (_ev: any, ctx: any) => {
    'worklet';
    const abPos = getEventAbsolute(_ev, ctx.marginH);

    // ANGLE ********
    const resultAngle = rotation(abPos, ctx, ctx.pointerAngle);
    angle.value = resultAngle;
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_ev, ctx: any) => {
      runOnJS(Keyboard.dismiss)();
      ctx.marginH = measurePageY;
      const abPos = getEventAbsolute(_ev, ctx.marginH);

      ctx.centers = getCenters(
        shapeWidth.value,
        shapeHeight.value,
        x.value,
        y.value,
      );
      // ***** ANGLE
      ctx.pointerAngle = rotation(abPos, ctx, angle.value);
      ctx.initAngle = angle.value;
    },
    onActive: (_ev: any, ctx: any) => {
      handleResizers(_ev, ctx);
    },
    onEnd: _ev => {
      runOnJS(editObjValues)();
    },
  });
  return (
    <PanGestureHandler enabled={true} onGestureEvent={gestureHandler}>
      <Animated.View>
        <FImage source={images.icon_rotation} style={styles.image24} />
      </Animated.View>
    </PanGestureHandler>
  );
};
export default EditItemsSymbolRotate;
