import {useNavigation} from '@react-navigation/native';
import {observe} from 'mobx';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {View, ScrollView, Pressable, StyleSheet, Image} from 'react-native';
import {Text} from 'react-native-paper';
import useStores from '../../store/useStores';
import images from '../../utils/images';
import {
  bgRatio,
  clearAllLocal,
  getLocal,
  nestedCopy,
  reCalcPosition,
  removeDuplicate,
} from '../../utils/libs';
import styles, {imgW3} from '../../utils/styles';
import {defTransOptions} from '../../utils/symbolList';
import FImage from '../common/fimage';
import LoadingScreen from '../common/loading';
import RecommandItem from '../recommend/RecommandItem';
import Spinner from '../Spinner';
import SvgBg from '../svg/SvgBg';

const CurrentLogoItem = observer(() => {
  const navigation = useNavigation();
  const [dataList, dataListSet] = useState([]);
  const [isLoading, isLoadingSet] = useState(false);
  const [mounted, mountedSet] = useState(false);
  const {store} = useStores();
  const scrollRef = useRef(null);

  // const checkStorage = observe(store, change => {
  //   if (change.name === 'myStorage') {
  //     // console.log(
  //     //   change.type,
  //     //   change.name,
  //     //   'from',
  //     //   change.oldValue,
  //     //   'to',
  //     //   change.object[change.name],
  //     // );
  //     getLoadSymbol();
  //   }
  // });
  const getLoadSymbol = async () => {
    // console.log('store.myStorage:', store.myStorage);
    // const myStorage = (await getLocal('myStorage')) || [];
    const myStorage = store.myStorage.slice(0, 5);
    isLoadingSet(true);
    let allSymbol = nestedCopy(myStorage);
    allSymbol = removeDuplicate(allSymbol, 'key');
    const containerWidth = imgW3;
    let originW = 600;
    const list = allSymbol.map(item => {
      item.value = item.value.map(d2 => {
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
            // result.w = reCalcPosition(newRatio.width, containerWidth, originW);
            // result.h = reCalcPosition(newRatio.height, containerWidth, originW);
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
          // result.w += 20;

          if (!result.align && result.center === 1) {
            result.align = 'center';
          }
        }
        // console.log(result);
        return result;
      });
      return item;
    });
    dataListSet(list);
    isLoadingSet(false);
    setTimeout(() => {
      mountedSet(true);
      store.setChangeStorage(false);
    }, 1);
  };
  // clearAllLocal();
  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('blur');
      setTimeout(() => {
        scrollRef?.current?.scrollTo({
          x: 0,
          y: 0,
          animated: false,
        });
      }, 1000);
    });
    return unsubscribe;
  }, [navigation]);
  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (store.changeStorage) {
        getLoadSymbol();
      }
    });
    return unsubscribe;
  }, [navigation, store.changeStorage]);
  useEffect(() => {
    if (!mounted) {
      // checkStorage();
      getLoadSymbol();
    }
    // if (store.changeStorage) {
    //   getLoadSymbol();
    // }
  }, [mounted]);
  if (store.myStorage?.length === 0) {
    return null;
  }
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <View>
      <View style={[styles.rowbc]}>
        <Text style={styles.titleText}>최근 로고</Text>
        <Pressable
          onPress={() => navigation.navigate('MyStorageApp')}
          style={styles.rowcc}>
          <Text style={style.moreTxt}>MORE</Text>
          <FImage style={styles.icon12} source={images.icon_more} />
        </Pressable>
      </View>
      <View style={[styles.mb20]}>
        <ScrollView
          ref={scrollRef}
          style={[styles.flex1, styles.pt10]}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {dataList.map((data, index) => {
            return (
              <Pressable
                onPress={async () => {
                  // const myStorage = (await getLocal('myStorage')) || [];
                  const myStorage = store.myStorage;
                  navigation.navigate('EditMode', {
                    target: 'storage',
                    key: data.key,
                    data: myStorage.filter(item => item.key === data.key)[0]
                      .value,
                  });
                }}
                key={index}
                style={style.itemWrap}>
                {data?.value[0].type === 'bg' && (
                  <View style={styles.abs00}>
                    <SvgBg
                      data={{
                        ...data?.value[0],
                        w: imgW3,
                        h: imgW3,
                      }}
                    />
                  </View>
                )}
                <View
                  style={[
                    style.itemSize,
                    {
                      width: data.value[0].w,
                      height: data.value[0].h,
                    },
                  ]}>
                  {data?.value
                    // .sort((a, b) => {
                    //   return a.zIndex < b.zIndex ? -1 : 1;
                    // })
                    .map((data2, index2) => {
                      return <RecommandItem data={data2} key={index2} />;
                    })}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
});
export default CurrentLogoItem;

const style = StyleSheet.create({
  itemWrap: {
    width: imgW3,
    height: imgW3,
    marginRight: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 12,
  },
  itemSize: {
    // width: '100%',
    // height: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  moreTxt: {fontSize: 12, color: '#c4c4c4'},
});
