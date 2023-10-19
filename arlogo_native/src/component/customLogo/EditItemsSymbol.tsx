import {observer} from 'mobx-react-lite';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  Text as RNText,
  Keyboard,
} from 'react-native';
// import {DragTextEditor} from 'react-native-drag-text-editor';

import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {LogoContextProvider} from '../../screens/customLogo/context/LogoContextProvider';
import useStores from '../../store/useStores';

import images from '../../utils/images';
import styles from '../../utils/styles';
import SvgIcon from '../svg/SvgIcon';
import SvgText from '../svg/SvgText';
import EditItemsSymbolResize from './EditItemsSymbolResize';
import EditItemsSymbolRotate from './EditItemsSymbolRotate';
import {DragTextEditor} from 'react-native-drag-text-editor';
import {Text} from 'react-native-paper';
import {deviceSize, isEmptyObject, isIos} from '../../utils/libs';
import FImage from '../common/fimage';
import JustText from '../svg/JustText';

const EditItemsSymbol = observer(
  ({
    item,
    activeIndex,
    setActiveIndex,
    removeItem,
    editObjValues,
    measurePageY,
    isEditTextSet,
    editTextSet,
    editText,
    onChangeText,
    submitChangeText,
    onlyObjListUpdate,
    editObjValueByActiveIndex,
    changeKey,
  }: // params,
  any) => {
    const {store} = useStores();
    const textRef = useRef(null);
    const key = useSharedValue<number>(item.key);
    const x = useSharedValue<number>(item.x);
    const y = useSharedValue<number>(item.y);
    const shapeWidth = useSharedValue<number>(item.w);
    const shapeHeight = useSharedValue<number>(item.h);
    const angle = useSharedValue<number>(item.angle || 0);
    const scale = useSharedValue<number>(item.scale || 1);
    // const absMarginY = useSharedValue<number>(measurePageY);
    const selected = useSharedValue<boolean>(item.selected);
    const fontSize = useSharedValue<number>(item.fontSize);
    const [currentFontSize, currentFontSizeSet] = useState(item.fontSize);
    // const [changeKey, changeKeySet] = useState(0);
    const [mounted, mountedSet] = useState(false);
    const hasColors = item.color?.split(',');
    const selectedColor1 = hasColors[0];
    // console.log('width:', shapeWidth.value);

    let opacity = item.opacity || 1;
    let letterSpacing = item.letterSpacing || 0;
    let lineHeight = item.lineHeight || 1;
    let radian = item.radian || 0;

    // 투명도
    if (
      store.sliderValues?.key === activeIndex &&
      item.key === store.sliderValues?.key &&
      store.sliderValues?.opacityValue
    ) {
      // console.log('opacity:', store.sliderValues?.opacityValue);
      opacity = store.sliderValues?.opacityValue;
    }
    // 자간
    if (
      store.sliderValues?.key === activeIndex &&
      item.key === store.sliderValues?.key &&
      store.sliderValues?.letterSpacing
    ) {
      // console.log('letterSpacing:', store.sliderValues?.letterSpacing);
      letterSpacing = store.sliderValues?.letterSpacing;
    }
    //줄간
    if (
      store.sliderValues?.key === activeIndex &&
      item.key === store.sliderValues?.key &&
      store.sliderValues?.lineHeight
    ) {
      lineHeight = store.sliderValues?.lineHeight;
    }
    if (
      store.sliderValues?.key === activeIndex &&
      item.key === store.sliderValues?.key &&
      store.sliderValues?.radian
    ) {
      radian = store.sliderValues?.radian;
    }

    const _editObjValues = () => {
      editObjValues(item.key, {
        x: x.value,
        y: y.value,
      });
    };
    const _editObjValuesResize = () => {
      editObjValues(item.key, {
        w: shapeWidth.value,
        h: shapeHeight.value,
        fontSize: currentFontSize,
      });
    };
    const _editObjValuesRotate = () => {
      editObjValues(item.key, {
        angle: angle.value,
      });
    };
    const updateValues = (oldW, newW) => {
      // if (item.type === 'text' || item.type === 'slogan') {
      const _fontSize = item.fontSize || 1;
      const newFontSize = (newW * _fontSize) / oldW;
      currentFontSizeSet(newFontSize);
      // }
    };
    const gestureHandler = useAnimatedGestureHandler(
      {
        onStart: (_, ctx: any) => {
          ctx.startX = x.value;
          ctx.startY = y.value;
        },
        onActive: (event: any, ctx: any) => {
          y.value = ctx.startY + event.translationY;
          x.value = ctx.startX + event.translationX;
        },
        onEnd: _ => {
          runOnJS(_editObjValues)();
        },
      },
      [],
    );

    const animatedPOositionStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {translateX: x.value || item.x},
          {translateY: y.value || item.y},
          {rotateZ: `${angle.value || 0}deg`},
        ],
        zIndex: item.zIndex,
        display: 'flex',
      };
    }, [x, y, shapeWidth, shapeHeight, angle]);

    const logoContextValues = useMemo(
      () => ({
        key,
        shapeWidth,
        shapeHeight,
        x,
        y,
        angle,
        scale,
        selected,
        fontSize,
      }),
      [key, shapeWidth, shapeHeight, x, y, angle, scale, selected, fontSize],
    );
    const checkSharedValue = () => {
      if (item.key !== key.value) {
        x.value = item.x;
        y.value = item.y;
        angle.value = item.angle || 0;
        scale.value = item.scale || 1;
        shapeWidth.value = item.w;
        shapeHeight.value = item.h;
        key.value = item.key;
        mountedSet(false);
      } else {
        mountedSet(true);
      }
    };
    if (
      store.sliderValues?.key === activeIndex &&
      item.key === store.sliderValues?.key &&
      store.sliderValues?.radian &&
      store.sliderValues?.w
    ) {
      shapeWidth.value = store.sliderValues?.w;
      onlyObjListUpdate(item.key, 'w', store.sliderValues?.w);
      console.log('width:', store.sliderValues?.w);
    }
    if (
      store.sliderValues?.key === activeIndex &&
      item.key === store.sliderValues?.key &&
      store.sliderValues?.radian &&
      store.sliderValues?.h
    ) {
      shapeHeight.value = store.sliderValues?.h;
      onlyObjListUpdate(item.key, 'h', store.sliderValues?.h);
      console.log('newHeight:', store.sliderValues?.h);
    }
    // Text Layout
    const _onTextLayout = (e: any) => {
      const {lines} = e.nativeEvent;
      const numberOfLine = lines.length;
      if (!numberOfLine) return;
      // console.log('lines:', lines[numberOfLine - 1]?.descender);
      // let {height, descender} = lines[numberOfLine - 1];
      let {height} = lines[numberOfLine - 1];
      // height += 10;
      const width = Math.max(...lines.map(d => d.width)) + 0;
      const newHeight = height * numberOfLine;
      // console.log(lines);
      // if (item.descenders === undefined) {
      //   editObjValues(item.key, {descenders: descenders});
      // }
      if (
        // editText !== '텍스트' &&
        // editText !== '' &&
        activeIndex === item.key &&
        submitChangeText
      ) {
        onChangeText(editText, width, newHeight, currentFontSize);
        console.log('7');
      }
      if (
        store.sliderValues?.key === activeIndex &&
        item.key === store.sliderValues?.key &&
        store.sliderValues?.w
      ) {
        shapeWidth.value = width;
        onlyObjListUpdate(item.key, 'w', width);
        console.log('width:', width);
        console.log('6');
      }
      if (
        store.sliderValues?.key === activeIndex &&
        item.key === store.sliderValues?.key &&
        store.sliderValues?.h
      ) {
        shapeHeight.value = newHeight;
        onlyObjListUpdate(item.key, 'h', newHeight);
        console.log('newHeight:', newHeight);
        console.log('5');
      }
      if (store.resizeWH && item.key === activeIndex) {
        shapeWidth.value = width;
        shapeHeight.value = newHeight;
        store.setResizeValues('wh', false);
        editObjValues(item.key, {
          w: width,
          h: newHeight,
        });
        // shapeWidth.value = withSpring(width);
        console.log('34');
      }
      if (store.resizeWidth && item.key === activeIndex) {
        shapeWidth.value = width;
        editObjValueByActiveIndex('w', width);
        store.setResizeValues('w', false);
        // shapeWidth.value = withSpring(width);
        console.log('4');
      }
      if (store.resizeHeight && item.key === activeIndex) {
        shapeHeight.value = newHeight;
        editObjValueByActiveIndex('h', newHeight);
        store.setResizeValues('h', false);
        // shapeHeight.value = withSpring(newHeight);
        console.log('3');
      }
      // console.log('???', changeKey);
      if (changeKey <= 1 && (item.type === 'text' || item.type === 'slogan')) {
        // editObjValueByActiveIndex('w', width);
        if (item.w !== width) {
          shapeWidth.value = width;
          shapeHeight.value = newHeight;
          console.log('init size', item.w, width, newHeight, item.type);
          const _fontSize = item.fontSize || 1;
          const newFontSize = (width * _fontSize) / item.w;
          let _x = 0;
          if (item.center === 1) {
            const containerWidth = deviceSize.width;
            console.log(width >= containerWidth, width, containerWidth);

            if (width < containerWidth) {
              _x = containerWidth / 2 - width / 2;
              x.value = _x;
            } else {
              x.value = 0;
            }
            onlyObjListUpdate(item.key, 'x', _x);
          }
          console.log('newFontSize:', item.type, item.fontSize, newFontSize);
          onlyObjListUpdate(item.key, 'w', width);
          onlyObjListUpdate(item.key, 'h', newHeight);
        }
      }
    };
    useEffect(() => {
      if (!mounted) {
        checkSharedValue();
      }
    }, []);
    return (
      <LogoContextProvider value={logoContextValues}>
        <PanGestureHandler
          enabled={item.selected}
          onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              style.gestureWrap,
              item.selected && style.selectedBorder,
              animatedPOositionStyles,
            ]}>
            {item.type === 'symbol' && (
              <Pressable
                onPress={() => {
                  console.log('item:', item.key);
                  setActiveIndex(item.key);
                }}>
                <SvgIcon
                  // key={currentFontSize}
                  item={{
                    ...item,
                    w: shapeWidth.value,
                    h: shapeHeight.value,
                  }}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </Pressable>
            )}
            {(item.type === 'text' || item.type === 'slogan') && (
              <Pressable
                onPress={() => {
                  setActiveIndex(item.key);
                }}>
                <SvgText
                  item={{
                    ...item,
                    fontSize: currentFontSize,
                    w: shapeWidth.value + 0,
                    h: shapeHeight.value + 0,
                  }}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
                {/* <JustText
                  item={{
                    ...item,
                    fontSize: currentFontSize * 1,
                    w: shapeWidth.value + 0,
                    h: shapeHeight.value + 0,
                  }}
                /> */}
              </Pressable>
            )}
            {item.selected && (
              <>
                <Pressable
                  onPress={() => {
                    removeItem(item.key);
                    mountedSet(false);
                  }}
                  style={style.iconTR}>
                  <Animated.View>
                    {/* <FImage source={images.icon_delete} style={styles.image24} /> */}
                    <FImage
                      source={images.icon_delete}
                      style={styles.image24}
                    />
                  </Animated.View>
                </Pressable>
                <Pressable style={style.iconBR}>
                  <EditItemsSymbolResize
                    measurePageY={measurePageY}
                    editObjValues={_editObjValuesResize}
                    updateValues={updateValues}
                    item={item}
                    activeIndex={activeIndex}
                  />
                </Pressable>
                <Pressable style={style.iconB}>
                  <EditItemsSymbolRotate
                    measurePageY={measurePageY}
                    editObjValues={_editObjValuesRotate}
                  />
                </Pressable>
                {(item.type === 'text' || item.type === 'slogan') && (
                  <Pressable
                    onPress={() => {
                      isEditTextSet(true);
                      // if(item.text)
                      editTextSet(item.text);
                      // setActiveIndex(item.key);
                    }}
                    style={[style.iconBL]}>
                    <Animated.View>
                      <FImage
                        source={images.icon_text_edit}
                        style={styles.image24}
                      />
                    </Animated.View>
                  </Pressable>
                )}
              </>
            )}
          </Animated.View>
        </PanGestureHandler>
        {item.type === 'text' && (
          <Text
            ref={textRef}
            // adjustsFontSizeToFit={true}
            onTextLayout={_onTextLayout}
            style={[
              style.tempText,
              style.subText,
              item.selected && style.selectedBorder,
              {
                color: selectedColor1,
                fontFamily: item.fontFamily,
                // fontSize: RFValue(currentFontSize, deviceSize.height),
                fontSize: currentFontSize,
                fontWeight: isIos ? item.fontWeight : undefined,
                opacity: opacity || 1,
                letterSpacing: currentFontSize * (letterSpacing / 100),
                lineHeight:
                  currentFontSize + currentFontSize * (lineHeight / 100) ||
                  currentFontSize,
                // letterSpacing: letterSpacing,
                // lineHeight: 1,
                textAlign: item.align,
              },
            ]}>
            {editText !== '텍스트' &&
            editText !== '' &&
            activeIndex === item.key
              ? editText
              : item.text}
          </Text>
        )}
        {item.type === 'slogan' && (
          <RNText
            // adjustsFontSizeToFit={true}
            onTextLayout={_onTextLayout}
            style={[
              style.tempText,
              style.subText,
              item.selected && style.selectedBorder,
              {
                color: selectedColor1,
                fontFamily: item.fontFamily,
                fontSize: currentFontSize,
                opacity: opacity || 1,
                letterSpacing: currentFontSize * (letterSpacing / 100),
                lineHeight:
                  currentFontSize + currentFontSize * (lineHeight / 100) ||
                  currentFontSize,
                textAlign: item.align,
              },
            ]}>
            {editText !== '텍스트' &&
            editText !== '' &&
            activeIndex === item.key
              ? editText
              : item.text}
          </RNText>
        )}
      </LogoContextProvider>
    );
  },
);
const style = StyleSheet.create({
  gestureRootStyles: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  gestureWrap: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    // alignSelf: 'flex-start',
    // borderStyle: 'dashed',
    // flex: 1,
    // backgroundColor: 'red',
    zIndex: 1,
    // padding: 0,
    // margin: 0,
  },
  selectedBorder: {
    borderColor: '#5794ff',
  },
  iconTR: {
    position: 'absolute',
    right: -16,
    top: -16,
    borderRadius: 16,
    width: 24,
    height: 24,
  },
  iconB: {
    position: 'absolute',
    left: '50%',
    marginLeft: -12,
    bottom: -36,
    borderRadius: 16,
    width: 24,
    height: 24,
  },
  iconBR: {
    position: 'absolute',
    right: -16,
    bottom: -16,
    borderRadius: 16,
    width: 24,
    height: 24,
  },
  iconBL: {
    position: 'absolute',
    left: -16,
    bottom: -16,
    // backgroundColor: 'red',
    borderRadius: 16,
    width: 24,
    height: 24,
    zIndex: 1000,
  },
  imageIcon: {
    width: 35,
    height: 35,
  },
  borderStyles: {
    borderStyle: 'dashed',
    borderColor: 'gray',
  },
  textStyles: {
    color: '#000',
  },
  cornerStyles: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: '#aaa',
  },
  tempText: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subText: {
    top: deviceSize.height * 2,
    // top: 0,
  },
});
export default EditItemsSymbol;
