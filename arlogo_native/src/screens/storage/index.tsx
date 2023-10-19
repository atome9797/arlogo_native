import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View, TouchableWithoutFeedback, PermissionsAndroid} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import {Button, Text} from 'react-native-paper';
import styles, {imgW2} from '../../utils/styles';
import ScreenContainer from '../../component/ScreenContainer';
import StorageLogo from '../../component/storage/StorageLogo';
import {
  bgRatio,
  deviceSize,
  setLocal,
  getLocal,
  isEmptyObject,
  nestedCopy,
  reCalcPosition,
  removeDuplicate,
  toast,
} from '../../utils/libs';
import {defTransOptions} from '../../utils/symbolList';
import RecommandItem from '../../component/recommend/RecommandItem';

import images from '../../utils/images';

import useStores from '../../store/useStores';

import ViewShot, {captureRef} from 'react-native-view-shot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ExportModal from '../../component/modals/exportModal';
import NotiBetaModal from '../../component/modals/notiBetaModal';
import FImage from '../../component/common/fimage';
import LoadingScreen from '../../component/common/loading';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from 'react-native-fs';

const MyStorageApp = ({navigation}: any) => {
  const snapRefs = useRef([]);
  const insets = useSafeAreaInsets();
  // console.log('insets:', insets);
  const [activeTab, activeTabSet] = useState(0);
  const [toastVisible, toastVisibleSet] = useState(false);
  const [betaModal, betaModalSet] = useState(false);
  const [isModal2d, isModal2dSet] = useState(false);
  const [isModal3d, isModal3dSet] = useState(false);
  const [isModalExport2d, isModalExport2dSet] = useState(false);
  const [dataLogoList, dataLogoListSet] = useState([]); //2d 로고 데이터 리스트
  const [dataModelList, dataModelListSet] = useState([]); //3d모델 데이터 리스트
  const [selectedData, selectedDataSet] = useState({});
  const [selected3DData, selected3DDataSet] = useState({});
  const [mounted, mountedSet] = useState(false);
  const {store} = useStores();
  const exportModalRef = useRef<BottomSheetModal>(null);
  const selectedRef = useRef<BottomSheetModal>(null);
  const selected3dRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [146 + insets.bottom], []);

  const AllData = async (data : any, total : any) => {
		try {
			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      
        data.map((result : any) => {
          RNFS.readFile(result['Thumbnail'], 'base64').then(resultParam => {
            
            console.log('ModelIndex', result['ModelIndex'])

            const ModelDataParam = {
              'LogoImage': result['LogoImage'],
              'ModelIndex': result['ModelIndex'],
              'Thumbnail': `data:image/png;base64,${resultParam}`,
              'ThumbnailPath' : result['Thumbnail'],
              'Storage' : total,
            }

            dataModelListSet(prev => prev.concat(ModelDataParam))

          })
          .catch(err => {
            console.log(err.message, err.code);
          })
          
        });


			} else {
				console.log('READ_EXTERNAL_STORAGE permission denied');
			}
		} catch (err) {
			console.log(err);
		}
 
  }

  useEffect(() => {

    try{
        AsyncStorage.getItem('unityStorage', (err, result) => {
          //const data = result["DataList"][0]
          if(result != null)
          {
            console.log('여기요', result)
            const {DataList} = JSON.parse(result!);
            console.log('여기요2', DataList)
            AllData(DataList, result);
          }
        });
    }
    catch(err){
      console.log('NO directory', err);
    }

  }, []);


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

  const getLoadSymbol = async () => {
    // const myStorage = (await getLocal('myStorage')) || [];
    const myStorage = store.myStorage;
    console.log('myStorage:', myStorage.length);
    let allSymbol = nestedCopy(removeDuplicate(myStorage, 'key'));
    const containerWidth = imgW2;
    let originW = 600;
    const list = allSymbol.map(item => {
      item['value'] = item.value.map(d2 => {
        const result = {...defTransOptions, ...d2};
        if (result.type === 'bg') {
          if (!result.color || result.color === '') {
            result.color = '#ffffff';
          }
          if (result.ratio === '1:1' || result.w === result.h) {
            originW = result.w;
          } else {
            originW = 600;
          }
        }
        result.x = reCalcPosition(result.x, containerWidth, originW);
        result.y = reCalcPosition(result.y, containerWidth, originW);
        result.w = reCalcPosition(result.w, containerWidth, originW);
        result.h = reCalcPosition(result.h, containerWidth, originW);
        if (!result.zIndex) {
          result.zIndex = result.key;
        }
        if (result.type === 'bg') {
          if (result.ratio) {
            const newRatio = bgRatio(
              result.ratio,
              containerWidth,
              containerWidth,
              0,
            );
            result.w = newRatio.width;
            result.h = newRatio.height;
          } else {
            result.ratio = '1:1';
          }
        }
        if (result.type === 'text' || result.type === 'slogan') {
          result.fontSize = reCalcPosition(
            result.fontSize,
            containerWidth,
            originW,
          );
        }
        return result;
      });
      return item;
    });
    dataLogoListSet(list);
    setTimeout(() => {
      mountedSet(true);
    }, 500);
  };
  useEffect(() => {
    if (!mounted) {
      setTimeout(() => {
        getLoadSymbol();
      }, 1000);
    }
  }, [mounted]);
  if (!mounted) {
    return <LoadingScreen />;
  }
  // Toast.show('삭제 완료되었습니다.');

  const todos = dataModelList.map((item : any, index : any) => (
    <Pressable
      onPress={() => {
        isModal3dSet(true);
        selected3DDataSet({
          target: 'step2',
          LogoImage: item['LogoImage'],
          Thumbnail: item['ThumbnailPath'],
          loadJson: item['Storage']
        });
        selected3dRef.current?.present();
      }}
      key={index}>
      <View
        style={[
          styles.imageListItem2,
          {
            borderRadius: 12,
            marginRight: (index + 1) % 2 == 0 ? 0 : 20,
          },
        ]}>
        <FImage
          style={styles.wh100}
          source={{
            uri: item['Thumbnail'],
          }}
        />
      </View>
    </Pressable>
  ))

  return (
    <ScreenContainer>
      <GestureHandlerRootView style={styles.flex1}>
        <BottomSheetModalProvider>
          {/* {mounted && <ActivityIndicator size={'large'} />} */}
          <View style={styles.flex1}>
            <View style={{flexDirection: 'row'}}>
              <TouchableWithoutFeedback onPress={() => activeTabSet(0)}>
                <View style={[styles.rowcc, style.tab50]}>
                  <Text
                    style={{color: activeTab === 0 ? '#5794ff' : '#888888'}}>
                    로고
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => activeTabSet(1)}>
                <View style={[styles.rowcc, style.tab50]}>
                  <Text
                    style={{color: activeTab === 1 ? '#5794ff' : '#888888'}}>
                    3D
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View> 
            {activeTab === 0 && (
              <ScrollView style={styles.flex1}>
                <View style={styles.p20}>
                  {dataLogoList.length > 0 ? (
                    <View style={styles.imageListWrap}>
                      {dataLogoList.map((data: any, index) => {
                        return (
                          <Pressable
                            key={index}
                            onPress={async () => {
                              const myStorage =
                                (await getLocal('myStorage')) || [];
                              // isModal2dSet(true);
                              selectedRef.current?.present();
                              selectedDataSet({
                                target: 'storage',
                                key: data.key,
                                index,
                                data: myStorage.filter(
                                  (item: any) => item.key === data.key,
                                )[0].value,
                              });
                            }}
                            style={[
                              style.itemWrap,
                              (index + 1) % 2 === 0 && styles.mr0,
                              {
                                borderColor: '#5794ff',
                                borderWidth:
                                  isModal2d && selectedData.key === data.key
                                    ? 2
                                    : 0,
                                // backgroundColor:
                                //   data?.value[0]?.color.split(',')[0],
                              },
                            ]}>
                            <ViewShot
                              ref={ref => (snapRefs.current[index] = ref)}>
                              <View
                                style={[
                                  style.itemSize,
                                  {
                                    width: data.value[0].w,
                                    height: data.value[0].h,
                                  },
                                ]}>
                                {data?.value.map(
                                  (_data: any, _index: number) => {
                                    return (
                                      <RecommandItem
                                        data={_data}
                                        key={_index}
                                      />
                                    );
                                  },
                                )}
                              </View>
                            </ViewShot>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={styles.flexcc}>
                      <Text
                        style={{color: '#888', fontSize: 18, marginTop: 60}}>
                        저장된 템플릿이 없습니다.
                      </Text>
                      <Button
                        // icon="camera"
                        mode="contained"
                        buttonColor="#5794ff"
                        textColor="#fff"
                        style={{borderRadius: 8, marginTop: 36}}
                        onPress={() => {
                          navigation.replace('Step1');
                        }}>
                        로고 제작
                      </Button>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
            {activeTab === 1 && (
              /*
              <ScrollView style={[styles.flex1, styles.p20]}>
                <View style={styles.flex1}>
                <FImage source={{uri: tester}} style={{width: 100, height: 50}} />
                </View>
              </ScrollView>*/
              <ScrollView style={styles.flex1}>
                <View style={styles.p20}>
                  <View style={styles.imageListWrap}>
                    {todos}
                  </View>
                </View>
              </ScrollView>
            )}
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
                  // backgroundColor: 'blue',
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                }}>
                <Pressable
                  onPress={() => selectedRef.current?.dismiss()}
                  style={style.closeWrap}>
                  <FImage
                    style={styles.icon24}
                    source={images.icon_close_gray}
                  />
                </Pressable>
                <View style={style.contentsWrap}>
                  <Pressable
                    style={style.buttonWrap}
                    onPress={() => {
                      navigation.navigate('EditMode', selectedData);
                      selectedRef.current?.dismiss();
                    }}>
                    <FImage style={styles.icon24} source={images.icon_edit} />
                    <Text style={style.text}>편집</Text>
                  </Pressable>

                  <Pressable
                    style={style.buttonWrap}
                    onPress={() => {
                      // navigation.getParent().setParams({didChange: true});
                      // console.log(navigation.setParams({didChange: true}));
                      //console.log();
                      // Toast.show('앨범에 저장되었습니다.');
                      // isModalExport2dSet(true);
                      selectedRef.current?.dismiss();
                      exportModalRef.current?.present();
                    }}>
                    <FImage
                      style={styles.icon24}
                      source={images.icon_download}
                    />
                    <Text style={style.text}>내보내기</Text>
                  </Pressable>

                  <Pressable
                    style={style.buttonWrap}
                    onPress={async () => {
                      if (!selectedData) {
                        selectedRef.current?.dismiss();
                        return;
                      }
                      // const myStorage = (await getLocal('myStorage')) || [];
                      const myStorage = nestedCopy(store.myStorage);
                      const findIndex = myStorage.findIndex(
                        item => item.key === selectedData.key,
                      );
                      myStorage.splice(findIndex, 1);
                      store.setMyStorage(myStorage);
                      dataLogoListSet(prev =>
                        prev.filter(item => item.key !== selectedData.key),
                      );
                      store.setChangeStorage(true);
                      toast('삭제 완료되었습니다.', 50);
                      selectedRef.current?.dismiss();
                    }}>
                    <FImage
                      style={styles.icon24}
                      source={images.icon_removeItem}
                    />
                    <Text style={style.text}>삭제</Text>
                  </Pressable>
                </View>
              </View>
            </BottomSheetModal>
            {/* </ModalContent>
            </BottomModal> */}
            {/* 로고 내보내기 하단 팝업 */}
            {!isEmptyObject(selectedData) && (
              <ExportModal
                exportModalRef={exportModalRef}
                isModalExport2d={isModalExport2d}
                isModalExport2dSet={isModalExport2dSet}
                betaModalSet={betaModalSet}
                selectedData={selectedData}
                snapRefs={snapRefs}
              />
            )}
            {/* 3D 항목클릭시 하단팝업 */}
            {/* <BottomModal
              style={{zIndex: 9999}}
              animationDuration={0}
              visible={isModal3d}
              onTouchOutside={() => isModal3dSet(false)}
              modalStyle={{backgroundColor: '#1f2024'}}
              height={126 + insets.bottom}>
              <ModalContent style={{paddingBottom: insets.bottom}}> */}
            <BottomSheetModal
              ref={selected3dRef}
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
                  onPress={() => selected3dRef.current?.dismiss()}
                  style={style.closeWrap}>
                  <FImage
                    style={styles.icon24}
                    source={images.icon_close_gray}
                  />
                </Pressable>
                <View style={style.contentsWrap}>
                  <View style={style.buttonWrap2}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('ARScreen', selected3DData);
                        isModal3dSet(false);
                      }}>
                      <FImage style={styles.icon24} source={images.icon_edit} />
                    </Pressable>
                    <Text style={style.text}>편집</Text>
                  </View>

                  <View style={style.buttonWrap2}>
                    <Pressable
                      onPress={async () => {
                        if (!selected3DData) {
                          isModal3dSet(false);
                          return;
                        }
                        
                        //데이터 불러오기
                        const {DataList} = (await getLocal('unityStorage')) || [];
                        
                        //데이터 필터 적용
                        dataModelListSet(
                          dataModelList.filter((d) => {			// "전체"가 아닐 경우 filter 함수를 사용하여 데이터를 걸러내겠다!
                            return d.ThumbnailPath !== selected3DData.Thumbnail;	// d(state 데이터 content)의 카테고리와 cate가 일치하면 생존!
                          })
                        )

                        const findIndex = DataList.findIndex(
                          item => item.Thumbnail === selected3DData.Thumbnail,
                        );
                        
                        DataList.splice(findIndex, 1);
                        setLocal('unityStorage', {DataList:DataList});
                        store.setChangeStorage(true);


                        //저장소에서 썸네일 파일 삭제
                        RNFS.unlink(selected3DData.Thumbnail).then(res => {
                            console.log("썸네일 삭제 성공", res)
                        })
                        .catch(err => {
                            console.log(err.message, err.code);
                        });

                        //저장소에서 로고 파일 삭제
                        RNFS.unlink(selected3DData.LogoImage).then(res => {
                          console.log("로고 삭제 성공", res)
                        })
                        .catch(err => {
                            console.log(err.message, err.code);
                        });

                        toast('삭제 완료되었습니다.', 50);
                        isModal3dSet(false);
                        selected3dRef.current?.dismiss()
                        
                      }}>
                      <FImage
                        style={styles.icon24}
                        source={images.icon_removeItem}
                      />
                    </Pressable>
                    <Text style={style.text}>삭제</Text>
                  </View>
                </View>
              </View>
            </BottomSheetModal>
            {/* </ModalContent>
            </BottomModal> */}
            <NotiBetaModal betaModal={betaModal} betaModalSet={betaModalSet} />
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ScreenContainer>
  );
};
const style = StyleSheet.create({
  bg: {backgroundColor: '#0c0c10'},
  handle: {display: 'none'},
  tab50: {
    width: '50%',
    paddingVertical: 20,
    backgroundColor: '#0c0c10',
  },
  itemWrap: {
    width: imgW2,
    height: imgW2,
    marginRight: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrap2: {
    width: '100%',
    height: deviceSize.height - 160,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSize: {
    // backgroundColor: 'transparent',
    // overflow: 'hidden',
  },
  closeWrap: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginBottom: 0,
  },
  contentsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
    flex: 1,
    // backgroundColor: 'red',
  },
  buttonWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '33%',
    marginVertical: 20,
  },
  buttonWrap2: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  imageWrap: {
    width: 24,
    height: 24,
  },
  text: {marginTop: 10, color: '#fff'},
  exportFormatItem: {
    width: (deviceSize.width - 60) / 3,
    borderColor: '#707070', // #5794ff
    borderWidth: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
export default MyStorageApp;
