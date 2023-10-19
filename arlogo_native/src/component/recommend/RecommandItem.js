import React from 'react';
import {View, StyleSheet, Text as RNText} from 'react-native';
import {isIos} from '../../utils/libs';
import JustText from '../svg/JustText';
import SvgBg from '../svg/SvgBg';
import SvgIcon from '../svg/SvgIcon';
import SvgText from '../svg/SvgText';

const RecommandItem = ({data}) => {
  return (
    <View
      style={[
        style.gestureWrap,
        {
          transform: [
            {translateX: data.x},
            {translateY: data.y},
            // {scale: data.scale || 1},
            {rotateZ: `${data.angle || 0}deg`},
          ],
          zIndex: data.zIndex,
        },
      ]}>
      {data.type === 'bg' && <SvgBg data={data} />}
      {data.type === 'symbol' && <SvgIcon item={data} />}
      {(data.type === 'text' || data.type === 'slogan') && (
        <SvgText
          item={{
            ...data,
          }}
          via="common"
        />
      )}
    </View>
  );
};
const style = StyleSheet.create({
  gestureWrap: {
    position: 'absolute',
    zIndex: 1,
  },
  tempText: {
    margin: 0,
    padding: 0,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subText: {
    top: 0,
    left: 0,
  },
  selectedBorder: {
    borderColor: '#f00',
  },
});
export default RecommandItem;
