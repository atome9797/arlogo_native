import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Image, Pressable, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {
  calcPosition,
  copyObj,
  deviceSize,
  nestedCopy,
  shuffleArray,
} from '../../utils/libs';
import styles, {imgW2, imgW3} from '../../utils/styles';
import {defTransOptions, symbolList} from '../../utils/symbolList';
import RecommandItem from '../recommend/RecommandItem';

const RecommandLogoItem = () => {
  const navigation = useNavigation();
  const [dataList, dataListSet] = useState([]);
  const [mounted, mountedSet] = useState(false);
  const getLoadSymbol = async () => {
    const containerWidth = imgW3;
    console.log('symbolList Total:', symbolList.length);
    let allSymbol = nestedCopy(
      shuffleArray(symbolList).filter((v, i) => i < 9),
    );
    // let allSymbol = nestedCopy(
    //   symbolList.filter((v, i) => i >= 210 && i <= 250),
    // );
    const list = allSymbol.map(item => {
      const [key] = Object.keys(item);
      const [values] = Object.values(item);
      item[key] = values.map(d2 => {
        const result = {...defTransOptions, ...d2};
        result.x = calcPosition(result.x, containerWidth);
        result.y = calcPosition(result.y, containerWidth);
        result.w = calcPosition(result.w, containerWidth);
        result.h = calcPosition(result.h, containerWidth);
        result.zIndex = result.key;
        if (result.type === 'bg') {
          result.ratio = '1:1';
        }
        if (result.type === 'text' || result.type === 'slogan') {
          result.fontSize = calcPosition(result.fontSize, containerWidth);
          if (result.center === 1) {
            result.align = 'center';
          }
        }
        return result;
      });
      return item;
    });
    // console.log('list.length:', list.length);
    dataListSet(list);
    mountedSet(true);
  };
  useEffect(() => {
    if (!mounted) {
      getLoadSymbol();
    }
  }, [mounted]);
  if (!mounted) {
    return null;
  }
  // console.log('dataList:', dataList, deviceSize.width, imgW2, imgW3);
  return (
    <View>
      <View style={[styles.rowbc, styles.pb10]}>
        <Text style={styles.titleText}>추천 로고</Text>
      </View>
      <View style={styles.imageListWrap}>
        {dataList.length > 0 &&
          dataList.map((arr, index) => {
            const [key] = Object.keys(arr);
            const [values] = Object.values(arr);
            const bg = values.filter(d => d.type === 'bg')[0];
            const color = bg?.color?.split(',')[0];

            return (
              // <Pressable onPress={() => console.log(arr)} key={index}>
              <Pressable
                onPress={() => {
                  // console.log('key:', key);
                  // getLoadSymbol();
                  navigation.navigate('EditMode', {
                    target: 'edit',
                    key,
                  });
                }}
                key={index}>
                <View
                  style={[
                    styles.imageListItem,
                    style.itemWrap,
                    (index + 1) % 3 !== 0 && style.mr10,
                  ]}>
                  {values
                    .sort((a, b) => {
                      return a.key < b.key ? -1 : 1;
                    })
                    // .filter(d => d.type !== 'bg')
                    .map((data, index) => {
                      // console.log(data.type, data.key);
                      return <RecommandItem data={data} key={index} />;
                    })}
                </View>
              </Pressable>
            );
          })}
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  itemWrap: {
    overflow: 'hidden',
    borderRadius: 12,
    marginRight: 0,
  },
  mr10: {
    marginRight: 10,
  },
});
export default RecommandLogoItem;
