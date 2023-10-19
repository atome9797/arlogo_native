import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Text, TextInput} from 'react-native-paper';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {
  colorList,
  deviceSize,
  getLocal,
  isIos,
  radianlXY,
  setLocal,
} from '../../../utils/libs';
import images from '../../../utils/images';
import styles from '../../../utils/styles';
import HsvColorPicker from '../../colorPicker';
import chroma from 'chroma-js';
import {LinearGradient, RadialGradient} from 'react-native-gradients';
import FImage from '../../common/fimage';
import {DismissKeyboardView} from '../../DismissKeyboardView';
const ColorModal = ({
  changeColor,
  changeGradientType,
  modalRef,
  selectedColor,
  type,
}: any) => {
  const hasColors = selectedColor.split(',');
  const selectedColor1 = hasColors[0] || '#fff';
  const selectedColor2 =
    hasColors.length > 1 ? hasColors[1].trim() : selectedColor1;
  const colorPicker = useRef(null);
  const [hsv, hsvSet] = useState({
    hue: (selectedColor && chroma(selectedColor1)?.hsv()[0]) || 0,
    sat: (selectedColor && chroma(selectedColor1)?.hsv()[1]) || 0,
    val: (selectedColor && chroma(selectedColor1)?.hsv()[2]) || 1,
  });

  const snapPoints = useMemo(() => ['50%'], []);
  // const snapPoints = useMemo(() => [deviceSize.height / 2], []);
  const [activeTab, activeTabSet] = useState(0);
  const [searchColor, searchColorSet] = useState('');
  const [isColorPicker, isColorPickerSet] = useState(false);
  const [selectedGradientPoint, selectedGradientPointSet] = useState(0);
  const [currentColorList, currentColorListSet] = useState([] as string[]);
  const [pickerSize, pickerSizeSet] = useState({w: 200, h: 200});
  const [currentGradientPicker, currentGradientPickerSet] = useState(0);

  const _currentColorListSet = async (value: any) => {
    if (!currentColorList.includes(value)) {
      const result = [value, ...currentColorList].slice(0, 5);
      // console.log('currentColors', result);
      await setLocal('currentColors', result);
      currentColorListSet(result);
    }

    // currentColorListSet(prev => {
    //   if (!prev.includes(value)) {
    //     const result = [value, ...prev].slice(0, 5);
    //     console.log('currentColors', result);
    //     setLocal('currentColors', result);
    //     return result;
    //   }
    //   return prev;
    // });
  };
  const onSatValPickerChangeSaveLocal = async ({saturation, value}) => {
    const _value = {
      sat: saturation,
      val: value,
    };
    const hvs = await colorPicker.current?.getCurrentColor();
    // if (activeTab === 0) {
    _currentColorListSet(hvs);
    // console.log('hvs:', hvs);
    // }
    hsvSet(prev => ({...prev, ..._value}));
  };
  const onSatValPickerChangeNonLocal = ({saturation, value}) => {
    const _value = {
      sat: saturation,
      val: value,
    };
    const hvs = colorPicker.current?.getCurrentColor();
    hsvSet(prev => ({...prev, ..._value}));
  };
  // console.log(hsv);
  const onHuePickerChange = ({hue}) => {
    const _value = {
      hue,
    };
    hsvSet(prev => ({...prev, ..._value}));
  };
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        // pressBehavior="close"
        onPress={() => modalRef.current?.dismiss()}
      />
    ),
    [],
  );

  const [mounted, mountedSet] = useState(false);
  // useEffect(() => {
  //   if (!mounted && selectedColor) {
  //     console.log(currentColor, selectedColor);
  //     currentColorSet(selectedColor);
  //     mountedSet(true);
  //   }
  // }, [mounted, currentColor]);
  useEffect(() => {
    const checkHistory = async () => {
      const items = await getLocal('currentColors');
      // console.log('currentColors local:', items);
      if (items) {
        currentColorListSet(items);
      }
    };
    if (!mounted) {
      checkHistory();
      mountedSet(true);
    }
  }, [mounted]);
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      enablePanDownToClose
      snapPoints={snapPoints}
      onDismiss={() => {
        isColorPickerSet(false);
        activeTabSet(0);
        currentGradientPickerSet(0);
        searchColorSet('');
      }}
      backdropComponent={renderBackdrop}
      keyboardBehavior={isIos ? 'extend' : 'interactive'}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      // onChange={handleSheetChanges}
      enableDismissOnClose
      backgroundStyle={style.bg}
      // backgroundStyle={{backgroundColor: '#f0f'}}
      handleStyle={style.handle}
      handleIndicatorStyle={style.handle}>
      <View style={style.modalHeaderWrap}>
        <Text variant="titleMedium">색상</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      {type !== 'symbol' && (
        <View style={{flexDirection: 'row'}}>
          <TouchableWithoutFeedback onPress={() => activeTabSet(0)}>
            <View
              style={[
                styles.rowcc,
                style.tab50,
                activeTab === 0 && {borderTopColor: '#5794ff'},
              ]}>
              <Text style={{color: activeTab === 0 ? '#5794ff' : '#888888'}}>
                색상
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => activeTabSet(1)}>
            <View
              style={[
                styles.rowcc,
                style.tab50,
                activeTab === 1 && {borderTopColor: '#5794ff'},
              ]}>
              <Text style={{color: activeTab === 1 ? '#5794ff' : '#888888'}}>
                그라데이션
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
      {activeTab === 0 && (
        <BottomSheetScrollView contentContainerStyle={style.bg}>
          <View style={style.modalScrollWrap}>
            <Pressable
              onPress={() => {
                isColorPickerSet(true);
              }}>
              <View style={[style.colorWrap, style.addCustomColorWrap]}>
                <View
                  style={[
                    style.colorInner,
                    style.addCustomColor,
                    {paddingTop: 10},
                  ]}>
                  <Text style={style.addCustomColorText}>+</Text>
                </View>
              </View>
            </Pressable>
            {currentColorList?.length > 0 &&
              currentColorList
                .filter((item, index) => index < 5)
                .map((item, index) => (
                  <Pressable
                    onPress={() => {
                      changeColor(item);

                      hsvSet({
                        hue: chroma(item).hsv()[0] || 0,
                        sat: chroma(item).hsv()[1] || 0,
                        val: chroma(item).hsv()[2] || 1,
                      });
                    }}
                    key={index}>
                    <View
                      style={[
                        style.colorWrap,
                        {
                          borderColor:
                            selectedColor1 === item ? '#5794ff' : 'transparent',
                          marginRight: (index + 1) % 6 === 0 ? 0 : 5,
                        },
                      ]}>
                      <View
                        style={[style.colorInner, {backgroundColor: item}]}
                      />
                    </View>
                  </Pressable>
                ))}
          </View>
          <View style={{paddingHorizontal: 24}}>
            <Text>기본색상</Text>
          </View>
          <View style={style.container}>
            {colorList.map((item, index) => (
              <Pressable
                onPress={() => {
                  changeColor(item);
                  hsvSet({
                    hue: chroma(item).hsv()[0] || 0,
                    sat: chroma(item).hsv()[1] || 0,
                    val: chroma(item).hsv()[2] || 1,
                  });
                  _currentColorListSet(item);
                }}
                key={index}>
                <View
                  style={[
                    style.colorWrap,
                    {
                      borderColor:
                        selectedColor1 === item ? '#5794ff' : 'transparent',
                      marginRight: (index + 1) % 6 === 0 ? 0 : 5,
                    },
                  ]}>
                  <View
                    style={[
                      style.colorInner,
                      {
                        backgroundColor: item,
                      },
                    ]}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </BottomSheetScrollView>
      )}
      {activeTab === 1 && (
        <View style={{flex: 1}}>
          <View style={[style.modalScrollWrap, style.gradWrap]}>
            <BottomSheetScrollView
              contentContainerStyle={[style.bg]}
              horizontal>
              {[...Array(9).keys()].map((item, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      selectedGradientPointSet(item);
                      changeGradientType(item);
                    }}
                    key={index}>
                    <View
                      style={[
                        style.colorGradWrap,
                        selectedGradientPoint === item &&
                          style.colorGradSelected,
                      ]}>
                      <View style={[style.colorInner, styles.hidden]}>
                        {item < 5 ? (
                          <RadialGradient
                            x={radianlXY(item).x}
                            y={radianlXY(item).y}
                            rx="100%"
                            ry="100%"
                            colorList={[
                              {
                                offset: '0%',
                                color: selectedColor1,
                                opacity: '1',
                              },
                              {
                                offset: '100%',
                                color: selectedColor2,
                                opacity: '1',
                              },
                            ]}
                          />
                        ) : (
                          <LinearGradient
                            colorList={[
                              {
                                offset: '0%',
                                color: selectedColor1,
                                opacity: '1',
                              },
                              {
                                offset: '100%',
                                color: selectedColor2,
                                opacity: '1',
                              },
                            ]}
                            angle={(item - 5) * 90}
                          />
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </BottomSheetScrollView>
          </View>
          <View style={style.gradientPickerWrap}>
            <View
              style={{
                width: 114,
                marginRight: 20,
              }}>
              <View style={[styles.rowbc, {marginBottom: 8}]}>
                <Pressable
                  onPress={() => {
                    currentGradientPickerSet(0);
                    hsvSet({
                      hue: chroma(selectedColor1).hsv()[0] || 0,
                      sat: chroma(selectedColor1).hsv()[1] || 0,
                      val: chroma(selectedColor1).hsv()[2] || 1,
                    });
                  }}>
                  <FImage
                    source={
                      currentGradientPicker === 0
                        ? images.icon_grad_picker1
                        : images.icon_grad_picker2
                    }
                    style={style.icon2428}
                  />
                  <View
                    style={[
                      style.gradientPickerInner,
                      {backgroundColor: selectedColor1},
                    ]}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    currentGradientPickerSet(1);
                    hsvSet({
                      hue: chroma(selectedColor2).hsv()[0] || 0,
                      sat: chroma(selectedColor2).hsv()[1] || 0,
                      val: chroma(selectedColor2).hsv()[2] || 1,
                    });
                  }}>
                  <FImage
                    source={
                      currentGradientPicker === 1
                        ? images.icon_grad_picker1
                        : images.icon_grad_picker2
                    }
                    style={style.icon2428}
                  />
                  <View
                    style={[
                      style.gradientPickerInner,
                      {backgroundColor: selectedColor2},
                    ]}
                  />
                </Pressable>
              </View>
              <View style={style.gradientPickerResult}>
                <LinearGradient
                  colorList={[
                    {offset: '0%', color: selectedColor1, opacity: '1'},
                    {offset: '100%', color: selectedColor2, opacity: '1'},
                  ]}
                  angle={0}
                />
              </View>
              <View>
                <View style={style.selectedHexWrap}>
                  <View
                    style={[
                      style.selectedHexInner,
                      {
                        backgroundColor:
                          currentGradientPicker === 0
                            ? selectedColor1
                            : selectedColor2,
                      },
                    ]}
                  />
                  <Text style={{fontSize: 16, color: '#fff'}}>
                    {currentGradientPicker === 0
                      ? selectedColor1
                      : selectedColor2}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flex: 1}}>
              <HsvColorPicker
                ref={colorPicker}
                huePickerHue={hsv.hue}
                onHuePickerDragMove={onHuePickerChange}
                onHuePickerPress={onHuePickerChange}
                satValPickerHue={hsv.hue}
                satValPickerSaturation={hsv.sat}
                satValPickerValue={hsv.val}
                onSatValPickerDragMove={onSatValPickerChangeNonLocal}
                onSatValPickerPress={color => {
                  onSatValPickerChangeSaveLocal(color);
                  setTimeout(() => {
                    if (currentGradientPicker === 0) {
                      changeColor(
                        `${colorPicker.current?.getCurrentColor()},${selectedColor2}`,
                      );
                      // if (hasColors.length > 1) {
                      //   changeColor(
                      //     `${colorPicker.current?.getCurrentColor()},${selectedColor2}`,
                      //   );
                      // } else {
                      //   changeColor(colorPicker.current?.getCurrentColor());
                      // }
                    } else {
                      changeColor(
                        `${selectedColor1},${colorPicker.current?.getCurrentColor()}`,
                      );
                    }
                  }, 10);
                }}
                onSatValPickerDragEnd={color => {
                  onSatValPickerChangeSaveLocal(color);
                  setTimeout(() => {
                    if (currentGradientPicker === 0) {
                      changeColor(
                        `${colorPicker.current?.getCurrentColor()},${selectedColor2}`,
                      );
                      // if (hasColors.length > 1) {
                      //   changeColor(
                      //     `${colorPicker.current?.getCurrentColor()},${selectedColor2}`,
                      //   );
                      // } else {
                      //   changeColor(colorPicker.current?.getCurrentColor());
                      // }
                    } else {
                      changeColor(
                        `${selectedColor1},${colorPicker.current?.getCurrentColor()}`,
                      );
                    }
                  }, 10);
                }}
                // satValPickerSliderSize={60}
                huePickerBorderRadius={12}
                satValPickerBorderRadius={12}
                satValPickerContainerStyle={{
                  width: deviceSize.width - 174 - 30,
                }}
                // satValPickerContainerStyle={{width: '100%'}}
                satValPickerSize={120}
                huePickerBarHeight={120}
              />
            </View>
          </View>
        </View>
      )}
      {isColorPicker && (
        <TouchableWithoutFeedback
          accessible={false}
          onPress={() => {
            console.log('???');
            Keyboard.dismiss();
          }}>
          <View
            style={[
              style.colorPickerWrap,
              {
                minHeight: deviceSize.height / 4,
                // maxHeight: deviceSize.height / 2,
                // height: '100%',
                // left: 0,
                // top: 0,
                // backgroundColor: 'red',
                flex: 1,
                // height: 100,
              },
            ]}>
            <View style={[style.colorPickerInner, {height: 48}]}>
              <Pressable
                style={{marginRight: 10}}
                onPress={() => {
                  // console.log('back');
                  isColorPickerSet(false);
                  searchColorSet('');
                }}>
                <FImage
                  source={images.icon_back_arrow}
                  style={styles.image24}
                />
              </Pressable>
              <Text>#</Text>
              <BottomSheetTextInput
                style={style.colorPickerTextInput}
                placeholder="색상명 또는 색상값을 입력해주세요."
                placeholderTextColor={'#888'}
                numberOfLines={1}
                autoCorrect={false}
                // onBlur={() => {
                //   Keyboard.dismiss();
                // }}
                autoCapitalize="none"
                value={searchColor || ''}
                onChangeText={value => {
                  if (/^[0-9a-fA-F]+$/.test(value) || value == '') {
                    searchColorSet(value);
                    if (value.length === 6) {
                      // changeColor(`#${value}`);
                      // hsvSet({
                      //   hue: chroma(value).hsv()[0] || 0,
                      //   sat: chroma(value).hsv()[1] || 0,
                      //   val: chroma(value).hsv()[2] || 1,
                      // });
                    }
                  }
                }}
                maxLength={6}
              />
              <Pressable
                style={{marginRight: 10}}
                onPress={() => {
                  // console.log('back');
                  if (searchColor.length === 6) {
                    changeColor(`#${searchColor}`);
                    hsvSet({
                      hue: chroma(searchColor).hsv()[0] || 0,
                      sat: chroma(searchColor).hsv()[1] || 0,
                      val: chroma(searchColor).hsv()[2] || 1,
                    });
                    // changeColor('');
                    // Keyboard.dismiss();
                  }
                  // isColorPickerSet(false);
                }}>
                <FImage source={images.icon_search} style={styles.image24} />
              </Pressable>
            </View>
            <View
              style={[style.colorPickerCustomWrap]}
              onLayout={event => {
                event.target.measure((x, y, width, height, pageX, pageY) => {
                  console.log(x, y, width, height, pageX, pageY);
                  pickerSizeSet({w: width - pageX - 32, h: height});
                });
              }}>
              <HsvColorPicker
                ref={colorPicker}
                huePickerHue={hsv.hue}
                onHuePickerDragMove={onHuePickerChange}
                onHuePickerPress={onHuePickerChange}
                satValPickerHue={hsv.hue}
                satValPickerSaturation={hsv.sat}
                satValPickerValue={hsv.val}
                onSatValPickerDragMove={onSatValPickerChangeNonLocal}
                onSatValPickerPress={color => {
                  onSatValPickerChangeSaveLocal(color);
                  setTimeout(() => {
                    changeColor(colorPicker.current?.getCurrentColor());
                  }, 100);
                }}
                onSatValPickerDragEnd={color => {
                  onSatValPickerChangeSaveLocal(color);
                  changeColor(colorPicker.current?.getCurrentColor());
                }}
                // satValPickerSliderSize={60}
                huePickerBorderRadius={12}
                satValPickerBorderRadius={12}
                satValPickerContainerStyle={{width: pickerSize.w}}
                // satValPickerContainerStyle={{width: '100%', maxHeight: 214}}
                satValPickerSize={pickerSize.h - 20}
                huePickerBarHeight={pickerSize.h - 20}
              />
            </View>
            <View>
              <View style={[style.selectedHexWrap, {height: 36}]}>
                <View
                  style={[
                    style.selectedHexInner,
                    {backgroundColor: selectedColor1},
                  ]}
                />
                <Text style={{fontSize: 16, color: '#fff'}}>
                  {selectedColor1}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </BottomSheetModal>
  );
};
const style = StyleSheet.create({
  bg: {
    backgroundColor: '#0c0c10',
  },
  handle: {backgroundColor: '#31333c', display: 'none'},
  modalHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 14,
    borderBottomColor: '#1f2024',
    borderBottomWidth: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  modalScrollWrap: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  addCustomColorWrap: {
    borderWidth: 4,
    marginRight: 5,
  },
  addCustomColorText: {fontSize: 24, color: '#888'},
  addCustomColor: {
    backgroundColor: '#000',
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorWrap: {
    width: (deviceSize.width - 40 - 25) / 6,
    height: (deviceSize.width - 40 - 25) / 6,
    borderWidth: 3,
    marginBottom: 5,
    borderRadius: 12,
    // padding: 2,
  },
  gradWrap: {
    borderBottomColor: '#31333c',
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  colorGradWrap: {
    width: (deviceSize.width - 40 - 25) / 6.5,
    height: (deviceSize.width - 40 - 25) / 6.5,
    borderWidth: 3,
    marginBottom: 5,
    borderRadius: 12,
    borderColor: 'transparent',
    marginRight: 5,
  },
  colorGradSelected: {
    borderColor: '#5794ff',
  },
  colorInner: {
    width: '100%',
    height: '100%',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 12,
  },
  tab50: {
    width: '50%',
    paddingVertical: 20,
    backgroundColor: '#0c0c10',
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  colorPickerWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#0c0c10',
  },
  colorPickerInner: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  colorPickerTextInput: {
    paddingVertical: 0,
    height: 40,
    backgroundColor: '#0c0c10',
    flex: 1,
    paddingHorizontal: 0,
    borderBottomColor: '#888',
    borderBottomWidth: 1,
    color: '#fff',
  },
  colorPickerCustomWrap: {
    flex: 1,
    width: '100%',
    // height: 100,
    marginTop: 14,
    marginBottom: 8,
    borderWidth: 0,
    borderColor: '#888',
    // backgroundColor: 'red',
  },
  selectedHexWrap: {
    flexDirection: 'row',
    backgroundColor: '#25262b',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingRight: 8,
  },
  selectedHexInner: {
    width: 24,
    height: 24,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 8,
  },
  gradientPickerWrap: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 164,
    marginTop: 10,
  },
  icon2428: {
    width: 24,
    height: 28,
  },
  gradientPickerInner: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    position: 'absolute',
    left: 2,
    top: 2,
  },
  gradientPickerResult: {
    height: 20,
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
});
export default ColorModal;
