import React, {useCallback, useEffect, useMemo} from 'react';
import {Image, Pressable, StyleSheet, View, Text as RNText} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {cacheFonts, fontList, isIos} from '../../../utils/libs';
import images from '../../../utils/images';
import styles from '../../../utils/styles';
import FImage from '../../common/fimage';

const FontModal = ({modalRef, currentValue, changeValue}: any) => {
  const [value, setValue] = React.useState(
    // fontList.filter(item => item.fontFamily === currentValue)[0] ||
    currentValue || fontList[0].fontFamily,
  );
  const snapPoints = useMemo(() => ['50%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  // const fonts = [
  //   {
  //     fontName: 'Anton-Regular',
  //     fontUrl: 'https://indidea.net/css/Anton-Regular.ttf',
  //   },
  //   {
  //     fontName: 'Advent',
  //     fontUrl:
  //       'https://fonts.gstatic.com/s/adventpro/v9/V8mCoQfxVT4Dvddr_yOwjVmtLZxcBtItFw.ttf',
  //   },
  // ];
  // useEffect(() => {
  //   const loadFont = async () => {
  //     await cacheFonts(fonts);
  //   };
  //   loadFont();
  // }, []);
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      enablePanDownToClose
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      // onChange={handleSheetChanges}
      backgroundStyle={style.bg}
      handleStyle={style.bg}
      handleIndicatorStyle={{backgroundColor: '#31333c'}}>
      <View style={style.modalHeaderWrap}>
        <Text variant="titleMedium">폰트</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      <BottomSheetScrollView contentContainerStyle={style.bg}>
        <RadioButton.Group
          onValueChange={val => {
            const target = fontList.filter(item => item.fontFamily === val)[0];
            setValue(val);
            changeValue('fontFamily', target.fontFamily);
            changeValue('fontWeight', target.fontWeight || 'normal');
          }}
          value={value}>
          {fontList.map((item, index) => (
            <RadioButton.Item
              key={index}
              label={item.name}
              // value={item.fontFamily}
              value={item.fontFamily}
              position="leading"
              mode="android"
              labelStyle={[
                style.fontLabel,
                {
                  fontWeight: item.fontWeight || 'normal',
                  fontFamily: item.fontFamily,
                },
              ]}
              color="#5794ff"
              uncheckedColor="#888"
              status={value === item.name ? 'checked' : 'unchecked'}
              style={{paddingBottom: 12, paddingLeft: 20}}
            />
          ))}
        </RadioButton.Group>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
const style = StyleSheet.create({
  bg: {
    backgroundColor: '#0c0c10',
  },
  modalHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 14,
    borderBottomColor: '#1f2024',
    borderBottomWidth: 1,
  },
  fontLabel: {
    textAlign: 'left',
    marginLeft: 5,
  },
});
export default FontModal;
