import React, {useCallback, useMemo} from 'react';
import {Image, Pressable, StyleSheet, View, Text as RNText} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {fontList} from '../../../utils/libs';
import images from '../../../utils/images';
import styles from '../../../utils/styles';
import FImage from '../../common/fimage';

const RatioModal = ({modalRef, changeValue}: any) => {
  const [value, setValue] = React.useState(fontList[0].fontFamily);
  const snapPoints = useMemo(() => [200], []);
  const ratioList = [
    {
      text: '1:1',
      source: images.icon_ratio_1_1,
      onPress: () => {
        changeValue('1:1');
      },
    },
    {
      text: '2:3',
      source: images.icon_ratio_2_3,
      onPress: () => {
        changeValue('2:3');
      },
    },
    {
      text: '3:4',
      source: images.icon_ratio_3_4,
      onPress: () => {
        changeValue('3:4');
      },
    },
    {
      text: '9:16',
      source: images.icon_ratio_9_16,
      onPress: () => {
        changeValue('9:16');
      },
    },
    {
      text: '3:2',
      source: images.icon_ratio_3_2,
      onPress: () => {
        changeValue('3:2');
      },
    },
    {
      text: '4:3',
      source: images.icon_ratio_4_3,
      onPress: () => {
        changeValue('4:3');
      },
    },
    {
      text: '16:9',
      source: images.icon_ratio_16_9,
      onPress: () => {
        changeValue('16:9');
      },
    },
  ];

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
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      enablePanDownToClose
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      // onChange={handleSheetChanges}
      backgroundStyle={style.bg}
      handleStyle={style.handle}
      handleIndicatorStyle={style.handle}>
      <View style={style.modalHeaderWrap}>
        <Text variant="titleMedium">비율</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      <BottomSheetScrollView
        contentContainerStyle={[style.contentsWrap]}
        horizontal={true}>
        {ratioList.map((item, index) => (
          <Pressable onPress={item.onPress} key={index}>
            <View style={style.iconWrap}>
              <FImage style={styles.icon24} source={item.source} />
              <Text style={style.iconText}>{item.text}</Text>
            </View>
          </Pressable>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const style = StyleSheet.create({
  bg: {
    backgroundColor: '#0c0c10',
  },
  handle: {backgroundColor: '#31333c', display: 'none'},
  modalHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 14,
    borderBottomColor: '#1f2024',
    borderBottomWidth: 1,
  },
  contentsWrap: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#0c0c10',
  },
  iconWrap: {paddingHorizontal: 16, alignItems: 'center'},
  iconText: {marginTop: 10, color: '#fff'},
});
export default RatioModal;
