import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {fastImageResize} from '../../utils/libs';

const FImage = ({source, style, resize = ''}) => {
  return (
    <FastImage
      style={style}
      source={source}
      resizeMode={fastImageResize(resize)}
    />
  );
};
export default FImage;
const style = StyleSheet.create({
  container: {
    zIndex: 10,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
