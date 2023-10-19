import React from 'react';
import {Image, Keyboard} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useLogoContext} from '../../screens/customLogo/hooks/useLogoContext';
import images from '../../utils/images';
import styles from '../../utils/styles';
import useStores from '../../store/useStores';
import FImage from '../common/fimage';

const EditItemsSymbolResize = ({
  measurePageY,
  editObjValues,
  updateValues,
  item,
  activeIndex,
}: any) => {
  const {store} = useStores();
  const {shapeWidth, shapeHeight, fontSize, scale, x, y} = useLogoContext();

  const _resetStoreValue = () => {
    store.setSliderValues({});
  };

  const handleResizers = (_ev: any, ctx: any) => {
    'worklet';
    // WIDTH, HEIGHT *******
    const whRatio = ctx.h / ctx.w;
    const boxWidth = ctx.w + _ev.translationX;
    const boxHeight = boxWidth * whRatio;
    shapeWidth.value = boxWidth;
    shapeHeight.value = boxHeight;
    runOnJS(updateValues)(ctx.h, boxHeight);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_ev, ctx: any) => {
      runOnJS(Keyboard.dismiss)();
      ctx.marginH = measurePageY;

      ctx.w = shapeWidth.value + 0;
      ctx.h = shapeHeight.value + 0;
    },
    onActive: (_ev: any, ctx: any) => {
      handleResizers(_ev, ctx);
    },
    onEnd: _ev => {
      runOnJS(_resetStoreValue)();
      runOnJS(editObjValues)();
    },
  });
  return (
    <PanGestureHandler enabled={true} onGestureEvent={gestureHandler}>
      <Animated.View>
        <FImage source={images.icon_scale} style={styles.image24} />
      </Animated.View>
    </PanGestureHandler>
  );
};
export default EditItemsSymbolResize;
