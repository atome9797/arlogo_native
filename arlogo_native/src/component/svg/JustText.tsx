import {observer} from 'mobx-react-lite';
import React, {useRef} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {isIos} from '../../utils/libs';

const JustText = observer(({item}: any) => {
  const fontSize = item.fontSize;
  const letterSpacing = item.letterSpacing || 1;
  const lingHeight = item.lineHeight || 0;
  return (
    <View
      style={{
        minWidth: item.w + 0,
        minHeight: item.h + 0,
        // backgroundColor: 'red',
      }}>
      <Text
        style={[
          style.tempText,
          {
            color: item.color?.split(',')[0],
            fontFamily: item.fontFamily,
            fontSize: fontSize * 1,
            fontWeight: isIos ? item.fontWeight : undefined,
            opacity: item.opacity || 1,
            letterSpacing: fontSize * (letterSpacing / 100),
            lineHeight: fontSize + fontSize * (lingHeight / 100) || fontSize,
            textAlign: item.align || 'left',
          },
        ]}>
        {item.text}
      </Text>
    </View>
  );
});

export default JustText;
const style = StyleSheet.create({
  tempText: {
    margin: 0,
    padding: 0,
    // position: 'absolute',
    borderWidth: 1,
    borderColor: 'transparent',
    // width: '100%',
    flexShrink: 1,
  },
});
