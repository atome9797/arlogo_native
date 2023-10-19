import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, ScrollView, Pressable, Image} from 'react-native';
import {Text} from 'react-native-paper';
import ScreenContainer from '../../component/ScreenContainer';
import {
  calcPosition,
  convertOriginTo1OnO,
  deviceSize,
  isEmptyObject,
  nestedCopy,
  saveToMyStorage,
} from '../../utils/libs';
import styles, {imgW2} from '../../utils/styles';
import {ModalContent, BottomModal} from 'react-native-modals';
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';
import images from '../../utils/images';
import {defTransOptions, symbolList} from '../../utils/symbolList';
import RecommandItem from '../../component/recommend/RecommandItem';
import useStores from '../../store/useStores';
import Spinner from '../../component/Spinner';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GotoMainModal from '../../component/modals/gotoMainModal';
import ExportModal from '../../component/modals/exportModal';
import ViewShot, {captureRef} from 'react-native-view-shot';
import NotiBetaModal from '../../component/modals/notiBetaModal';
import FImage from '../../component/common/fimage';
import LoadingScreen from '../../component/common/loading';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// console.log('allSymbol::', allSymbol);
const RecommendList = ({navigation, route}: any) => {
  const {params} = route;
  const snapRefs = useRef([] as any[]);
  const insets = useSafeAreaInsets();
  const [isLoading, isLoadingSet] = useState(true);
  const [betaModal, betaModalSet] = useState(false);
  const [selectedData, selectedDataSet] = useState({});
  const [originDataList, originDataListSet] = useState([] as any);
  const [dataList, dataListSet] = useState([] as any);
  const [mounted, mountedSet] = useState(false);
  const [closeModal, closeModalSet] = useState(false);
  // const [editModal, editModalSet] = useState(false);
  const [isModalExport, isModalExportSet] = useState(false);
  const [selectedKey, selectedKeySet] = useState('');
  const pageSize = 10;
  const [page, pageSet] = useState(0);
  const {store} = useStores();
  // const [offsetY, offsetYSet] = useState(0);
  const [isLast, isLastSet] = useState(false);

  const exportModalRef = useRef<BottomSheetModal>(null);
  const selectedRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [146 + insets.bottom], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        enableTouchThrough={true}
        onPress={() => selectedRef.current?.dismiss()}
      />
    ),
    [],
  );

  const createItem = () => {
    navigation.navigate('EditMode', {
      // ...params,
      customData: params,
      target: 'new',
    });
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => {
            closeModalSet(true);
          }}>
          <FImage style={styles.icon24} source={images.icon_close} />
        </Pressable>
      ),
    });
  }, [navigation]);

  const getLoadSymbol = useCallback(async () => {
    const containerWidth = imgW2;
    const useSlogan = params.slogan !== '';
    let allSymbol = originDataList;
    if (originDataList.length === 0) {
      let tempArr = nestedCopy(symbolList);
      const {adjective} = params;
      // const _adjective = adjective[0].split(',');
      // console.log(adjective.split(','));
      allSymbol = await tempArr.filter((item: any) => {
        const target = Object.values(item)[0][0];
        const category1 = target?.category1;
        const category2 = target?.category2.split(',').map(Number);
        return (
          category1 === params.category &&
          category2.some((r: any) => adjective.indexOf(r) >= 0)
        );
      });
      allSymbol = (await Promise.all(allSymbol)) || [];
      console.log('??allSymbol', allSymbol.length);
      originDataListSet(allSymbol);
    }
    // let allSymbol = _allData;
    // console.log(allSymbol?.length);
    if (allSymbol?.length > 0) {
      const list = allSymbol
        .filter((item, index) => {
          if (page === 0) {
            return index < (page + 1) * pageSize;
          } else {
            return index >= page * pageSize && index < (page + 1) * pageSize;
          }
        })
        .map((item2: any) => {
          const [key] = Object.keys(item2);
          let [values] = Object.values(item2);
          if (!useSlogan) {
            values = values.filter(d => d.type !== 'slogan');
          }
          item2[key] = values;
          return item2;
        })
        .map(item => {
          const key = Object.keys(item);
          const values = Object.values(item)[0];
          item[key] = values.map((d2: any) => {
            const result = {...defTransOptions, ...d2};
            result.x = calcPosition(result.x, containerWidth);
            result.y = calcPosition(result.y, containerWidth);
            result.w = calcPosition(result.w, containerWidth);
            result.h = calcPosition(result.h, containerWidth);
            if (result.type === 'text' || result.type === 'slogan') {
              const widthPerText = result.w / result.text.length;
              result.fontSize = calcPosition(result.fontSize, containerWidth);
              console.log('origin text:', key, result.text);
              result.text =
                result.type === 'text' ? params.logoName : params.slogan;
              const newMaxTextLength = Math.max(
                ...result.text.split('\n').map((t: string) => t.length),
              );
              // console.log('w0:', result.w, newMaxTextLength, widthPerText);
              result.w = newMaxTextLength * widthPerText + 30;
              // console.log('w1:', result.w, newMaxTextLength, widthPerText);
              if (result.center === 1) {
                result.align = 'center';
                // console.log(
                //   result.text,
                //   result.w >= containerWidth,
                //   result.w,
                //   containerWidth,
                // );
                if (result.w >= containerWidth) {
                  result.x = 0;
                } else {
                  result.x = containerWidth / 2 - result.w / 2;
                }
                // console.log('result.x:', result.x);
                // result.x = containerWidth / 2 - result.w / 2;
              }
            }
            return result;
          });
          return item;
        });
      // console.log('list:', list.length);
      if (list.length === 0) {
        isLastSet(true);
      }
      pageSet(prev => prev + 1);
      // console.log();
      dataListSet(prev => [...prev, ...list]);
      mountedSet(true);
      setTimeout(() => {
        isLoadingSet(false);
      }, 1000);
    } else {
      setTimeout(() => {
        isLoadingSet(false);
      }, 2000);
      dataListSet([]);
    }
    // console.log(list);
  }, [page, isLast]);
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    var paddingToBottom = 150;
    let bottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    return bottom;
  };
  // const handleParentLayout = e => {
  //   console.log(e);
  // };
  // console.log('mounted:', mounted, isLoading);
  useEffect(() => {
    // getLoadSymbol();
    if (!mounted) {
      if (params) {
        setTimeout(() => {
          getLoadSymbol();
        }, 1000);
      } else {
        navigation.navigate('Root');
        mountedSet(true);
      }
    }
  }, []);
  // useEffect(() => {
  //   const interactionPromise = InteractionManage.runAfterInteractions(() =>
  //     onShown(),
  //   );
  //   return () => interactionPromise.cancel();
  // }, [onShown]);
  if (!mounted && isLoading) {
    return <LoadingScreen />;
  }
  return (
    <ScreenContainer>
      <GestureHandlerRootView style={styles.flex1}>
        <BottomSheetModalProvider>
          <ScrollView
            // onLayout={handleParentLayout}
            scrollEventThrottle={200}
            style={styles.flex1}
            onScroll={({nativeEvent}) => {
              // const {y} = nativeEvent.contentOffset;
              // offsetYSet(parseInt(y));
              if (isCloseToBottom(nativeEvent) && !isLast) {
                if (dataList.length < pageSize) {
                  return;
                }
                isLoadingSet(true);
                getLoadSymbol();
              }
            }}>
            <View style={style.topWrapper}>
              <Text style={style.topText}>
                원하는 로고를 선택하여{'\n'}
                저장 및 편집이 가능합니다.
              </Text>
            </View>
            <View style={[styles.flex1, styles.p20]}>
              <View style={[styles.imageListWrap]}>
                <Pressable onPress={createItem}>
                  <View style={[style.itemWrap, styles.flexcc, styles.mr20]}>
                    <FImage
                      style={styles.icon24}
                      source={images.icon_new_plus}
                    />
                    <Text style={style.selfEditTxt}>직접 제작하기</Text>
                  </View>
                </Pressable>
                {dataList.length > 0 &&
                  dataList.map((arr: any, index: number) => {
                    const [key] = Object.keys(arr);
                    const [values] = Object.values(arr) as any;
                    // const bg = values.filter(d => d.type === 'bg')[0];
                    return (
                      <Pressable
                        onPress={() => {
                          selectedRef.current?.present();
                          selectedKeySet(key);
                          selectedDataSet({
                            target: 'storage',
                            key: key,
                            index,
                            data: values,
                          });
                          // editModalSet(true);
                        }}
                        key={index}
                        style={[
                          style.itemWrap,
                          (index + 1) % 2 === 0 && styles.mr20,
                          {
                            borderWidth: 2,
                            borderColor:
                              selectedKey === key ? '#5794ff' : 'transparent',
                          },
                        ]}>
                        <ViewShot ref={ref => (snapRefs.current[index] = ref)}>
                          <View
                            style={{
                              width: values[0].w,
                              height: values[0].h,
                            }}>
                            {values.map((data: any, _index: number) => {
                              return <RecommandItem data={data} key={_index} />;
                            })}
                          </View>
                        </ViewShot>
                      </Pressable>
                    );
                  })}
                {isLoading && (
                  <View
                    style={[
                      style.itemWrap,
                      (dataList.length + 1) % 2 === 0 && styles.mr20,
                      {
                        borderWidth: 0,
                        borderColor: 'transparent',
                      },
                    ]}>
                    <LoadingScreen />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          {/* 매인화면 이동 모달 */}
          <GotoMainModal
            closeModal={closeModal}
            closeModalSet={closeModalSet}
            navigation={navigation}
          />

          <BottomSheetModal
            ref={selectedRef}
            index={0}
            enablePanDownToClose
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            // onChange={handleSheetChanges}
            backgroundStyle={style.bg}
            handleStyle={style.handle}
            enableHandlePanningGesture={false}>
            <View
              style={{
                paddingBottom: insets.bottom,
                flex: 1,
                // backgroundColor: 'red',
                paddingHorizontal: 18,
                paddingVertical: 16,
              }}>
              <Pressable
                onPress={() => {
                  selectedRef.current?.dismiss();
                  selectedKeySet('');
                }}
                style={style.closeWrap}>
                <FImage style={styles.icon24} source={images.icon_close_gray} />
              </Pressable>
              <View style={style.bottomModalWrap}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('EditMode', {
                      customData: params,
                      target: 'edit',
                      key: selectedKey,
                    });
                    selectedRef.current?.dismiss();
                    selectedKeySet('');
                  }}
                  style={style.bottomModalInnerItem}>
                  <FImage
                    style={style.bottomModalInnerImage}
                    source={images.icon_edit}
                  />
                  <Text>편집</Text>
                </Pressable>

                <Pressable
                  onPress={async () => {
                    let [symbol] = nestedCopy(
                      symbolList.filter((item: any) => item[selectedKey]),
                    );
                    let [values] = Object.values(symbol) as any;
                    const containerWidth = deviceSize.width;
                    values = values.map((d2: any) => {
                      d2.x = calcPosition(d2.x, containerWidth);
                      d2.y = calcPosition(d2.y, containerWidth);
                      d2.w = calcPosition(d2.w, containerWidth);
                      d2.h = calcPosition(d2.h, containerWidth);
                      if (d2.type === 'text' || d2.type === 'slogan') {
                        const widthPerText = d2.w / d2.text.length;
                        d2.fontSize = calcPosition(d2.fontSize, containerWidth);
                        d2.text =
                          d2.type === 'text' ? params.logoName : params.slogan;
                        const newMaxTextLength = Math.max(
                          ...d2.text.split('\n').map((t: string) => t.length),
                        );
                        d2.w = newMaxTextLength * widthPerText + 30;
                        if (d2.center === 1) {
                          d2.align = 'center';
                          if (d2.w >= containerWidth) {
                            d2.x = 0;
                          } else {
                            d2.x = containerWidth / 2 - d2.w / 2;
                          }
                        }
                      }
                      return d2;
                    });
                    // console.log(values);
                    // // console.log(convertOriginTo1OnO(values));
                    // return;
                    const result = await saveToMyStorage(
                      selectedKey,
                      true,
                      values,
                    );
                    if (result) {
                      store.setChangeStorage(true);
                    }
                    selectedRef.current?.dismiss();
                    selectedKeySet('');
                  }}
                  style={style.bottomModalInnerItem}>
                  <FImage
                    style={style.bottomModalInnerImage}
                    source={images.icon_save}
                  />
                  <Text>내 보관함 저장</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    // Toast.show('앨범에 저장되었습니다.');
                    // isModalExportSet(true);
                    exportModalRef.current?.present();
                    selectedRef.current?.dismiss();
                    selectedKeySet('');
                  }}
                  style={style.bottomModalInnerItem}>
                  <FImage
                    style={style.bottomModalInnerImage}
                    source={images.icon_download}
                  />
                  <Text>내보내기</Text>
                </Pressable>
              </View>
            </View>
          </BottomSheetModal>
          {/* 로고 내보내기 하단 팝업 */}
          {/* {!isEmptyObject(selectedData) && (
          <ExportModal
            isModalExport2d={isModalExport}
            isModalExport2dSet={isModalExportSet}
            betaModalSet={betaModalSet}
            selectedData={selectedData}
            snapRefs={snapRefs}
          />
        )} */}
          {!isEmptyObject(selectedData) && (
            <ExportModal
              exportModalRef={exportModalRef}
              isModalExport2d={isModalExport}
              isModalExport2dSet={isModalExportSet}
              betaModalSet={betaModalSet}
              selectedData={selectedData}
              snapRefs={snapRefs}
            />
          )}
          <NotiBetaModal betaModal={betaModal} betaModalSet={betaModalSet} />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ScreenContainer>
  );
};
export default RecommendList;
const style = StyleSheet.create({
  bg: {backgroundColor: '#0c0c10'},
  handle: {display: 'none'},
  topWrapper: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 36,
  },
  topText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.44,
    textAlign: 'center',
    fontFamily: 'NanumBarunGothic',
  },
  selfEditTxt: {color: '#5794ff', fontSize: 16, marginTop: 13},
  itemWrap: {
    width: (deviceSize.width - 40 - 20) / 2,
    height: (deviceSize.width - 40 - 20) / 2,
    borderColor: '#2b4989',
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    marginRight: 0,
  },
  bottomModalWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
    flex: 1,
    // backgroundColor: 'blue',
  },
  bottomModalInnerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '33%',
    // paddingVertical: 10,
    // marginHorizontal: 30,
    // backgroundColor: 'red',
  },
  bottomModalInnerImage: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  closeWrap: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginBottom: 0,
  },
});
