import React from 'react';
import {View, Image, Pressable, StyleSheet} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import {Text} from 'react-native-paper';
import images from '../../utils/images';
import {deviceSize, isIos, StatusBarHeight} from '../../utils/libs';
import styles from '../../utils/styles';
import Swiper from 'react-native-swiper';
import FImage from '../common/fimage';
const visualList = [
  {image: images.visual01, text: '나만의 하나뿐인 로고를 디자인 하세요'},
  {image: images.visual02, text: '내가 만든 로고 AR로 생생하게 확인하세요'},
];
// console.log('StatusBarHeight', StatusBarHeight, isIos);
const TopVisual = ({navigation}) => {
  return (
    <View
      style={[styles.rowcc, style.container, {height: 260 + StatusBarHeight}]}>
      <Swiper
        horizontal={true}
        showsButtons={false}
        loop={true}
        autoplay={true}
        autoplayTimeout={3}
        paginationStyle={style.paginationPosition}
        index={0}>
        {visualList.map((item, index) => (
          <View style={styles.flex1} key={index}>
            <FImage
              source={item.image}
              style={style.image100}
              key={index}
              resize={'cover'}
            />
            <FImage
              source={images.img_dim}
              style={style.dimImage}
              // resize={'cover'}
            />
            <View style={style.visualDescPos}>
              <FImage
                source={images.visual_logo_text}
                style={style.visualDescText1}
              />
              <Text style={style.visualDescText2}>{item.text}</Text>
            </View>
          </View>
        ))}
      </Swiper>
      <Pressable
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        style={style.drawerMenu}>
        <FImage style={styles.icon24} source={images.icon_list} />
      </Pressable>
      <Pressable
        onPress={() => {
          navigation.navigate('MyStorageApp');
        }}
        style={style.myStorage}>
        <FImage style={styles.icon24} source={images.icon_storage} />
      </Pressable>
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // marginTop: isIos ? 0 : StatusBarHeight || 0,
    marginTop: 0,
    // paddingtop: 0,
    height: 260,
    width: deviceSize.width,
    // paddingTop: 40,
  },
  dimImage: {
    width: '100%',
    height: (372 * deviceSize.width) / 1080,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  drawerMenu: {
    position: 'absolute',
    left: 20,
    // top: isIos ? 20 : StatusBarHeight + 20 || 20,
    top: StatusBarHeight + 16,
  },
  myStorage: {
    position: 'absolute',
    right: 20,
    // top: 20,
    top: StatusBarHeight + 16,
  },
  paginationPosition: {
    position: 'absolute',
    left: 20,
    right: undefined,
    bottom: 16,
  },
  image100: {flex: 1, width: '100%', height: '100%'},
  visualDescPos: {
    position: 'absolute',
    left: 20,
    bottom: 45,
  },
  visualDescText1: {
    width: 130,
    height: 33,
  },
  visualDescText2: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'NanumBarunGothic',
    marginTop: 8,
  },
});

export default TopVisual;
