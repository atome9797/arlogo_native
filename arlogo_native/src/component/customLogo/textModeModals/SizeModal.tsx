import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import images from '../../../utils/images';
import FImage from '../../common/fimage';
// import {useLogoContext} from '../../../screens/customLogo/hooks/useLogoContext';
import Slider from '../textEditor/Slider/Slider';

const SizeModal = ({editFontSize, isFontSizeSet}: any) => {
  // const {sharedSliderValue} = useLogoContext();

  return (
    <View>
      <View style={style.modalHeaderWrap}>
        <Text variant="titleMedium">크기</Text>
        <Pressable onPress={() => isFontSizeSet(false)}>
          <FImage
            style={{
              width: 24,
              height: 24,
            }}
            source={images.icon_close_gray}
          />
        </Pressable>
      </View>
      {/* <Slider onEnded={() => editFontSize(sharedSliderValue.value)} /> */}
    </View>
  );
};
const style = StyleSheet.create({
  modalHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 14,
    borderBottomColor: '#1f2024',
    borderBottomWidth: 1,
  },
});
export default SizeModal;
