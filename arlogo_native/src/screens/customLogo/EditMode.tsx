import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Keyboard,
  Pressable,
  TextInput,
} from 'react-native';
import ScreenContainer from '../../component/ScreenContainer';
import {
  bgRatio,
  bringTo,
  calcPosition,
  deviceSize,
  nestedCopy,
  toast,
  shareSingleImage,
  getYMDHIS,
} from '../../utils/libs';

import styles from '../../utils/styles';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import EditModeHeader from '../../component/customLogo/EditModeHeader';
import EditModeBottom from '../../component/customLogo/EditModeBottom';
import EditModeSubText from '../../component/customLogo/EditModeSubText';
import EditModeSubSymbol from '../../component/customLogo/EditModeSubSymbol';
import EditModeSubBg from '../../component/customLogo/EditModeSubBg';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import images from '../../utils/images';
import {DismissKeyboardView} from '../../component/DismissKeyboardView';
import EditItemsSymbol from '../../component/customLogo/EditItemsSymbol';
import Toast from 'react-native-root-toast';
import {
  defLogoData,
  defSymbol,
  defTransOptions,
  symbolList,
} from '../../utils/symbolList';
import SvgBg from '../../component/svg/SvgBg';
import Modal from 'react-native-modal';
import {useHistory} from './hooks/useHistory';
import ViewShot, {captureRef} from 'react-native-view-shot';
import RNFS from "react-native-fs";
import useStores from '../../store/useStores';
import {Text} from 'react-native-paper';
import {useKeyboard} from '@react-native-community/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditMode = ({navigation, route}: any) => {
  const {params} = route;
  const {data} = params;
  const {state, past, future, setHistory, undo, redo, clear, canUndo, canRedo} =
    useHistory([]);
  const keyboard = useKeyboard();
  // const [elements, setElements, undo, redo] = useHistory([]);
  const [symbolKey, symbolKeySet] = useState('');
  const [currentMode, currentModeSet] = useState('');

  const [objList, objListSet] = useState(data);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mounted, mountedSet] = useState(false);
  const [measurePageY, measurePageYSet] = useState(0);
  const [isEditText, isEditTextSet] = useState(false);
  const [editText, editTextSet] = useState('');
  const [submitChangeText, submitChangeTextSet] = useState(false);
  const [changeKey, changeKeySet] = useState(0);
  const [isNewKey, isNewKeySet] = useState(true);
  const [containerSize, containerSizeSet] = useState({
    width: deviceSize.width,
    height: deviceSize.width,
  });
  const editTextRef = useRef(null);
  const snapRef = useRef(null);
  const {store} = useStores();

  const manualCapture = useCallback(() => {
    if (!objList?.length) return;
    if (!snapRef?.current) return;
    captureRef(snapRef, {
      format: 'png',
      quality: 1,
      width: 720,
      height: 1080,
      result: 'tmpfile',
    }).then(
      async uri => {
        store.setCurrentEditCapture({uri, ratio: objList[0]?.ratio || '1:1'});
        // console.log(uri);
        // shareSingleImage(uri);
        // const pdfFile = await myAsyncPDFFunction(uri);
        // if (pdfFile) {
        //   shareSingleImage(pdfFile);
        // }
        const filePath = `${RNFS.DocumentDirectoryPath}/Capture_${getYMDHIS()}.png`;

        console.log("경로" + RNFS.DocumentDirectoryPath)

        // 이미지를 files 폴더에 저장
        await RNFS.moveFile(uri, filePath);

        
        await RNFS.readDir(RNFS.DocumentDirectoryPath)
          .then((result) => {
            console.log('GOT Result', result);

            //stat the first file
            return Promise.all([RNFS.stat(result[0].path), result[0].path]);
          })
          .then((statResult) => {
            console.log('test', statResult)
            if (statResult[0].isFile()) {
              // if we have a file, read it
              return RNFS.readFile(statResult[1], 'base64');
            }
        
            return 'no file';
          })
          .then((contents) => {
            // log the file contents
            console.log(contents);
          })
          .catch((err) => {
            console.log(err.message, err.code);
          });
          


        await setTimeout(() => {
          AsyncStorage.getItem('unityStorage', (err, result) => {
            //const data = result["DataList"][0]
            if(result != null)
            {
              navigation.navigate('ARScreen', {
                target: 'step1',
                LogoImage: filePath,
                loadJson: result
              });
            }
            else{
              navigation.navigate('ARScreen', {
                target: 'step1',
                LogoImage: filePath
              });
            }
          });

        }, 10);
      },
      error => console.error('Oops, snapshot failed', error),
    );


    
  }, [objList]);

 
  // object 선택
  const _setActiveIndex = (index: number) => {
    const selectedItem = objList?.filter((item: any) => item.key === index);
    if (!selectedItem) {
      return;
    }

    _selectedItem(index);
    const type = selectedItem[0]?.type;

    if (type === 'text' || type === 'slogan') {
      currentModeSet('text');
    } else if (type === 'symbol') {
      currentModeSet('symbol');
    } else if (type === 'bg') {
      currentModeSet('bg');
    }
  };

  // object 선택 변경
  const _selectedItem = (key: number) => {
    const _index = objList.findIndex((item: any) => item.key === key);
    if (typeof _index !== 'number') return;
    // let newState = objList.map((obj: any) => {
    //   obj.selected = false;
    //   return obj;
    // });
    // newState[_index].selected = true;

    const newState = objList.map((obj: any) => {
      obj.selected = false;
      if (obj.key === key) {
        obj.selected = true;
      }
      return obj;
    });
    console.log('activeKey Changed', key);
    objListSet(newState);
    setActiveIndex(key);
  };

  // 모든선택 해제
  const allSelectedDisable = () => {
    const newState = objList.map((obj: any) => {
      obj.selected = false;
      return {...obj};
    });
    objListSet(newState);
  };
  const changeKeyUpdate = () => {
    changeKeySet(prev => prev + 1);
    console.log(
      '------------------------------------------------ changeKey:',
      changeKey,
    );
  };

  // objList 값 수정
  // object 이동후 전송
  const editObjValues = (key: number, prop: any) => {
    // const _index = objList.findIndex(item => item.key === activeIndex);
    // if (!activeIndex || !_index) return;
    // let newState = objList;
    // newState[_index] = {...newState[_index], ...prop};
    // if (
    //   (newState[_index].type === 'text' ||
    //     newState[_index].type === 'slogan') &&
    //   prop.w &&
    //   newState[_index].w !== prop.w
    // ) {
    //   const newFontSize2 =
    //     (prop.w * newState[_index].fontSize) / newState[_index].w;
    //   if (newFontSize2) {
    //     newState[_index].fontSize = newFontSize2;
    //     console.log('newFontSize2', newFontSize2);
    //   }
    // }
    const newState = objList.map((obj: any) => {
      if (obj.key === key) {
        // if (
        //   (obj.type === 'text' || obj.type === 'slogan') &&
        //   prop.w &&
        //   obj.w !== prop.w
        // ) {
        //   const newFontSize2 = (prop.w * obj.fontSize) / obj.w;
        //   if (newFontSize2) {
        //     obj.fontSize = newFontSize2;
        //     console.log('newFontSize2', newFontSize2);
        //   }
        // }
        return {...obj, ...prop};
      }
      return obj;
    });
    // console.log('editObjValues:', activeIndex, newState[_index]);
    // console.log(newState);
    objListSet(newState);
    setHistory(newState);
    changeKeyUpdate();
  };
  // 선택된 값 수정
  const editObjValueByActiveIndex = (prop: string, value: any) => {
    const _index = objList.findIndex(item => item.key === activeIndex);
    if (typeof activeIndex !== 'number' || typeof _index !== 'number') return;
    let newState = objList;
    newState[_index][prop] = value;

    objListSet(newState);
    setHistory(newState);
    changeKeyUpdate();
  };
  // 선택된 값 수정
  const onlyObjListUpdate = (
    key: number,
    prop: string,
    value: any,
    inInit: boolean = false,
  ) => {
    const _index = objList.findIndex(item => item.key === key);
    if (typeof activeIndex !== 'number' || typeof _index !== 'number') return;
    let newState = objList;
    newState[_index][prop] = value;
    objListSet(newState);
    if (inInit) {
      setHistory(newState);
    }
  };

  // 복제
  const duplicateItem = () => {
    const keys = objList.map(item => item.key);
    const newKey = Math.max(...keys) + 1;
    const thisIndex = objList.findIndex(item => item.key === activeIndex);
    if (
      (objList[thisIndex].type === 'text' ||
        objList[thisIndex].type === 'slogan') &&
      objList.filter(item => item.type === 'text' || item.type === 'slogan')
        .length >= maxTextCount
    ) {
      toast('텍스트는 최대 10개까지 추가 가능합니다.', 150);
      return false;
    }
    if (
      objList[thisIndex].type === 'symbol' &&
      objList.filter(item => item.type === 'symbol').length >= maxSymbolCount
    ) {
      toast('심볼은 최대 10개까지 추가 가능합니다.', 150);
      return false;
    }
    if (objList?.length === 0 || activeIndex === 0) {
      // Toast.show('복제할 아이템을 선택해주세요.');
      toast('복제할 아이템을 선택해주세요.', 150);
      return;
    }
    const result = [
      ...objList,
      {
        ...objList[thisIndex],
        key: newKey,
        x: containerSize.width / 2 - objList[thisIndex].w / 2,
        y: containerSize.height / 2 - objList[thisIndex].h / 2,
        selected: true,
      },
    ];
    // _setActiveIndex(newKey);
    setActiveIndex(newKey);
    allSelectedDisable();
    objListSet(result);
    setHistory(result);
    changeKeyUpdate();
  };

  const onChangeText = (text: string, w: number, h: number, fz: number) => {
    const _index = objList.findIndex((item: any) => item.key === activeIndex);
    // if (!activeIndex || !_index) return;
    if (typeof activeIndex !== 'number' || typeof _index !== 'number') return;

    const newState = objList.map((obj: any) => {
      if (
        obj.key === activeIndex &&
        (obj.type === 'text' || obj.type === 'slogan')
      ) {
        obj['text'] = text;
        obj['w'] = w;
        obj['h'] = h;
        obj['fontSize'] = fz;
      }
      return obj;
    });
    console.log('onChangeText:', activeIndex, text, w, h, fz);
    objListSet(newState);
    setHistory(newState);
    changeKeyUpdate();
    submitChangeTextSet(false);
    editTextSet('');
  };
  const _submitChangeTextSet = (value: boolean) => {
    submitChangeTextSet(value);
    changeKeyUpdate();
  };
  // 최대갯수 제한
  const maxSymbolCount = 10;
  const maxTextCount = 10;
  // 텍스트추가
  const addNewText = () => {
    if (
      objList.filter(item => item.type === 'text' || item.type === 'slogan')
        .length >= maxTextCount
    ) {
      toast('텍스트는 최대 10개까지 추가 가능합니다.', 150);
      return false;
    }
    // const nextKey = objList.length + 1;
    const keys = objList.map(item => item.key);
    const newKey = Math.max(...keys) + 1;
    const newState = [
      ...objList,
      {
        ...defTransOptions,
        key: newKey,
        zIndex: newKey,
        type: 'text',
        text: '텍스트',
        x: containerSize.width / 2 - 30,
        y: containerSize.width / 2 - 15,
        w: 60,
        h: 30,
        fontSize: 21,
        fontFamily: 'NanumMyeongjo',
        fontWeight: '400',
        selected: true,
      },
    ];
    // _setActiveIndex(newKey);
    setActiveIndex(newKey);
    allSelectedDisable();
    objListSet(newState);
    setHistory(newState);
    changeKeyUpdate();
    isEditTextSet(true);
    // console.log(keyboard.keyboardShown)
    setTimeout(() => {
      editTextRef.current?.focus();
    }, 100);
  };
  // console.log(editTextRef.current);

  // 심볼추가
  const addNewSymbol = (name: string, color: string) => {
    if (
      objList.filter(item => item.type === 'symbol').length >= maxSymbolCount
    ) {
      toast('심볼은 최대 10개까지 추가 가능합니다.', 150);
      return false;
    }
    const keys = objList.map(item => item.key);
    const newKey = Math.max(...keys) + 1;
    // console.log(name, color);
    const newState = [
      ...objList,
      {
        ...defSymbol,
        key: newKey,
        zIndex: newKey,
        type: 'symbol',
        name,
        color,
        x: containerSize.width / 2 - 60,
        y: containerSize.width / 2 - 60,
        w: 120,
        h: 120,
        selected: true,
      },
    ];
    // _setActiveIndex(newKey);
    setActiveIndex(newKey);
    allSelectedDisable();
    objListSet(newState);
    setHistory(newState);
    changeKeyUpdate();
  };

  // 삭제
  const removeItem = (key: number) => {
    const newState = objList.filter(item => item.key !== key);
    objListSet(newState);
    setHistory(newState);
    changeKeyUpdate();
  };

  // 뒤로 보내기
  const bringToBack = () => {
    const thisIndex = objList.findIndex(item => item.key === activeIndex);
    if (thisIndex === 1) {
      // Toast.show('처음입니다.');
      return;
    } else {
      const newState = bringTo(objList, thisIndex, thisIndex - 1).map(
        (item, index) => {
          item.zIndex = index;
          return item;
        },
      );
      // console.log('back:', newState);
      objListSet(newState);
      setHistory(newState);
      changeKeyUpdate();
    }
  };
  // 앞으로 가져오기
  const bringToFront = () => {
    const lastIndex = objList.length - 1;
    const thisIndex = objList.findIndex(item => item.key === activeIndex);
    if (lastIndex === thisIndex) {
      // Toast.show('마지막입니다.');
      return;
    } else {
      const newState = bringTo(objList, thisIndex, thisIndex + 1).map(
        (item, index) => {
          item.zIndex = index;
          return item;
        },
      );
      // console.log('front:', newState);
      objListSet(newState);
      setHistory(newState);
      changeKeyUpdate();
    }
  };
  const _undo = () => {
    changeKeyUpdate();
    undo();
    objListSet(past);
    // useUndoRedoSet(true);
    // console.log('newState:', state);
  };
  const _redo = () => {
    changeKeyUpdate();
    redo();
    objListSet(future);
    // useUndoRedoSet(true);
  };

  // 초기 세팅
  const getDataByKey = useCallback(() => {
    const {key, customData} = params;

    const containerWidth = containerSize.width;
    console.log('key:', key);
    symbolKeySet(key);
    let [allSymbol] = nestedCopy(symbolList.filter(item => item[key]));
    let [values] = Object.values(allSymbol) as any;
    if (customData && !customData.slogan) {
      values = values.filter(item => item.type !== 'slogan');
    }
    const initData = values?.map((d2: any) => {
      const result = {...defTransOptions, ...d2};

      result.x = calcPosition(result.x, containerWidth);
      result.y = calcPosition(result.y, containerWidth);
      // console.log('result.w:1', result.type, result.w, containerWidth);
      result.w = calcPosition(result.w, containerWidth);
      // console.log('result.w:2', result.type, result.w);
      result.h = calcPosition(result.h, containerWidth);
      result.zIndex = result.key;
      if (result.type === 'bg') {
        if (result.ratio) {
          const newRatio = bgRatio(result.ratio);
          containerSizeSet(newRatio);
          result.w = newRatio.width;
          result.h = newRatio.height;
        } else {
          result.ratio = '1:1';
        }
      }
      if (result.type === 'text' || result.type === 'slogan') {
        result.fontSize = calcPosition(result.fontSize, containerWidth);
        if (customData) {
          const widthPerText = result.w / result.text.length;
          result.text =
            result.type === 'text' ? customData.logoName : customData.slogan;
          const newMaxTextLength = Math.max(
            ...result.text.split('\n').map((t: string) => t.length),
          );
          // console.log('w0:', result.w, newMaxTextLength, widthPerText);
          result.w = newMaxTextLength * widthPerText;
          // console.log('w1:', result.w);
        }
        // console.log('result.center:', result.type, result.center);
        if (result.center === 1) {
          result.align = 'center';
          // console.log('center!!!!!!!!');
          // console.log(result.type, result.x, containerWidth / 2, result.w / 2);
          if (result.w >= containerWidth) {
            result.x = 0;
          } else {
            result.x = containerWidth / 2 - result.w / 2;
          }
          // console.log(result.x);
          // result.x = containerWidth / 2 - result.w / 2;
          // console.log('result.x:', result.x, containerWidth , result.w );
        }
      }
      // console.log('result:', result);
      return result;
    });
    objListSet(initData);
    setHistory(initData);
    mountedSet(true);
  }, []);
  // 1,2,3단계 이후 직접제작하기
  const setCustomMode = () => {
    const {customData} = params;
    const hasSlogan = customData.slogan && customData.slogan !== '';
    let dummyData = nestedCopy(
      defLogoData.filter(item => {
        if (!hasSlogan) {
          return item.type !== 'slogan';
        } else {
          return true;
        }
      }),
    );
    const newState = dummyData.map(item => {
      const result = {...defTransOptions, ...item};
      result.center = 1;
      if (result.type === 'text') {
        result.text = customData.logoName;
        result.w = customData.logoName.length * 46;
        if (result.w >= containerSize.width) {
          result.x = 0;
          console.log('result.x:', result.x, result.w, containerSize.width);
        } else {
          result.x = containerSize.width / 2 - result.w / 2;
          console.log('result.x:', result.x);
        }
      }
      if (hasSlogan && result.type === 'slogan') {
        result.text = customData.slogan;
        result.w = customData.slogan.length * 21;
        if (result.w >= containerSize.width) {
          result.x = 0;
        } else {
          result.x = containerSize.width / 2 - result.w / 2;
        }
      }
      return result;
    });
    // console.log('newState:', newState);

    symbolKeySet('newCustom');
    objListSet(newState);
    setHistory(newState);
    mountedSet(true);
  };
  // 최근로고
  const loadCustomData = () => {
    const {key, data: newState} = params;
    symbolKeySet(key);
    objListSet(newState);
    setHistory(newState);
    mountedSet(true);
    isNewKeySet(false);
    allSelectedDisable();
  };
  useEffect(() => {
    if (!mounted) {
      const {target} = params;
      if (target === 'edit') {
        getDataByKey();
      } else if (target === 'storage') {
        loadCustomData();
      } else if (target === 'new') {
        setCustomMode();
      }
    } else {
      // console.log('AAA');
      // getDataByKey();
    }
    // if (objList?.length !== state?.length) {
    //   objListSet(state);
    // }
    return () => {
      // objListSet([]);
      // console.log('unmounted!!!!');
    };
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <ScreenContainer>
      {/* <LogoContextProvider value={logoContextValues}> */}
      <GestureHandlerRootView style={styles.flex1}>
        <BottomSheetModalProvider>
          <View style={[styles.flex1]}>
            <EditModeHeader
              navigation={navigation}
              objList={objList}
              symbolKey={symbolKey}
              undo={_undo}
              redo={_redo}
              clear={clear}
              canUndo={canUndo}
              canRedo={canRedo}
              isNewKey={isNewKey}
              allSelectedDisable={allSelectedDisable}
              manualCapture={manualCapture}
            />
            <View style={style.editContainer}>
              <DismissKeyboardView>
                <ViewShot
                  ref={snapRef}
                  options={{
                    fileName: 'arLogo',
                    format: 'jpg',
                    quality: 1,
                    width: 300,
                    height: 300,
                  }}
                  // onCapture={onCapture}
                  // captureMode
                  // style={dimension}
                >
                  <ImageBackground
                    source={images.bg_transparent}
                    resizeMode="cover"
                    style={[
                      style.canvasWrap,
                      // (objList?.length > 0 && bgRatio(objList[0].ratio)) || {},
                    ]}>
                    <GestureHandlerRootView
                      style={[
                        style.gestureRootStyles,
                        // (objList?.length > 0 && bgRatio(objList[0].ratio)) || {},
                      ]}
                      onLayout={event => {
                        event.target.measure(
                          (x, y, width, height, pageX, pageY) => {
                            measurePageYSet(pageY - 56);
                          },
                        );
                      }}>
                      {/* <View style={style.container}> */}
                      {objList?.length > 0 &&
                        objList.map((item: any, index: number) => {
                          if (item?.type === 'bg') {
                            return (
                              <Pressable
                                key={index}
                                onPress={() => {
                                  console.log('item:', item.key);
                                  _setActiveIndex(item.key);
                                  Keyboard.dismiss();
                                }}>
                                <SvgBg data={item} />
                              </Pressable>
                            );
                          }
                          // const hasColors = item.color?.split(',');
                          // const selectedColor1 = hasColors[0];
                          return (
                            <View key={index} style={{position: 'absolute'}}>
                              <EditItemsSymbol
                                key={index + changeKey}
                                changeKey={changeKey}
                                // params={params}
                                item={item}
                                measurePageY={measurePageY}
                                // resetSelectText={resetSelectText}
                                activeIndex={activeIndex}
                                setActiveIndex={_setActiveIndex}
                                // selectedItem={selectedItem}
                                removeItem={removeItem}
                                editObjValues={editObjValues}
                                onChangeText={onChangeText}
                                isEditTextSet={isEditTextSet}
                                editTextSet={editTextSet}
                                editText={editText}
                                submitChangeText={submitChangeText}
                                onlyObjListUpdate={onlyObjListUpdate}
                                editObjValueByActiveIndex={(
                                  prop: string,
                                  value: any,
                                ) => editObjValueByActiveIndex(prop, value)}
                              />
                            </View>
                          );
                        })}
                      {/* </View> */}
                    </GestureHandlerRootView>
                  </ImageBackground>
                </ViewShot>
              </DismissKeyboardView>
            </View>
            {currentMode === 'text' && (
              <EditModeSubText
                // changeFontFamily={changeFontFamily}
                editObjValueByActiveIndex={(prop: string, value: any) =>
                  editObjValueByActiveIndex(prop, value)
                }
                // editFontSize={value => editFontSize(value)}
                addNewText={() => addNewText()}
                activeIndex={activeIndex}
                objList={objList}
                duplicateItem={duplicateItem}
                bringToBack={bringToBack}
                bringToFront={bringToFront}
              />
            )}
            {currentMode === 'symbol' && (
              <EditModeSubSymbol
                editObjValueByActiveIndex={(prop: string, value: any) =>
                  editObjValueByActiveIndex(prop, value)
                }
                activeIndex={activeIndex}
                objList={objList}
                bringToBack={bringToBack}
                bringToFront={bringToFront}
                duplicateItem={duplicateItem}
                addNewSymbol={addNewSymbol}
              />
            )}
            {currentMode === 'bg' && (
              <EditModeSubBg
                editObjValueByActiveIndex={(prop: string, value: any) =>
                  editObjValueByActiveIndex(prop, value)
                }
                activeIndex={activeIndex}
                objList={objList}
              />
            )}
            <EditModeBottom
              currentMode={currentMode}
              currentModeSet={currentModeSet}
              allSelectedDisable={allSelectedDisable}
              setActiveIndex={_setActiveIndex}
            />
          </View>
          <Modal
            isVisible={isEditText}
            backdropTransitionOutTiming={0}
            style={styles.modalStyle}
            avoidKeyboard={true}
            animationIn="fadeIn"
            animationOut="fadeOut"
            onModalShow={() => {
              setTimeout(() => {
                console.log('a');
                editTextRef?.current?.focus();
                // Keyboard?.show();
              }, 1);
            }}
            onBackdropPress={() => {
              console.log('asdfasd');
              // isEditTextSet(false)
            }}>
            <View style={style.modalContentWrap}>
              <TextInput
                ref={editTextRef}
                value={editText === '텍스트' ? '' : editText}
                onChangeText={editTextSet}
                multiline
                returnKeyType="next"
                autoCorrect={false}
                autoComplete={'off'}
                autoCapitalize={'none'}
                style={style.modifyText}
                underlineColorAndroid="rgba(0,0,0,0)"
              />
            </View>
            <View style={style.modalFooter}>
              <Pressable
                onPress={() => {
                  isEditTextSet(false);
                  editTextSet('');
                }}>
                <Text style={style.cancelText}>취소</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (editText.length === 0) {
                    // toast('텍스트를 입력해 주세요.', 150);
                    // return;
                    editTextSet('텍스트');
                  }

                  isEditTextSet(false);
                  // onChangeText(editText);
                  _submitChangeTextSet(true);
                  Keyboard.dismiss();
                }}>
                <Text style={style.completeText}>완료</Text>
              </Pressable>
            </View>
          </Modal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      {/* </LogoContextProvider> */}
    </ScreenContainer>
  );
};
const style = StyleSheet.create({
  cancelText: {color: '#333333', fontSize: 16, fontWeight: 'bold'},
  completeText: {color: '#3b72d3', fontSize: 16, fontWeight: 'bold'},
  container: {
    flex: 1,
  },
  modalContentWrap: {
    width: deviceSize.width,
    paddingHorizontal: 20,
    paddingVertical: 0,
    // backgroundColor: 'transparent',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    // backgroundColor: 'red',
    padding: 0,
    margin: 0,
    borderRadius: 0,
  },
  modifyText: {
    padding: 10,
    backgroundColor: '#1f2024',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#5794ff',
    borderRadius: 8,
    // minHeight: 50,
    fontSize: 14,
    // paddingTop: 10,
    // paddingBottom: 0,
    // textAlignVertical: 'top',
  },
  modalFooter: {
    backgroundColor: '#fff',
    margin: 0,
    paddingHorizontal: 20,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: deviceSize.width,
    paddingVertical: 15,
    borderRadius: 0,
  },
  canvasWrap: {
    width: deviceSize.width,
    height: deviceSize.width,
    overflow: 'hidden',
    position: 'relative',
  },
  itemsInnerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  itemsInnerButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  modalContent: {
    height: 80,
    // flex: 1,
    backgroundColor: '#0c0c10',
    // backgroundColor: 'red',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    position: 'absolute',
    left: 0,
    bottom: 80,
  },
  mb80: {marginBottom: 80},
  editContainer: {
    flex: 1,
    backgroundColor: '#1f2024',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestureRootStyles: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,

    width: deviceSize.width,
    height: deviceSize.width,
  },

  editorContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 20,
  },
  addTextButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontOptions: {
    margin: 2,
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  colorOptions: {
    margin: 4,
    flex: 1,
    padding: 20,
    borderRadius: 10,
  },

  bottomModalWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#0c0c10',
  },
  bottomModalInnerImage: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  imageWrap: {
    width: 24,
    height: 24,
  },
  dimension: {width: 300, height: 300},
});
export default EditMode;
