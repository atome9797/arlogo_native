import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View, Text as RNText} from 'react-native';
import {Text} from 'react-native-paper';

import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import images from '../../../utils/images';
// import Slider from 'react-native-slider';
import {Slider} from '@miblanchard/react-native-slider';
import styles from '../../../utils/styles';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FImage from '../../common/fimage';
const AlignModal = ({
  changeValue,
  modalRef,
  align,
  activeIndex,
  objList,
}: any) => {
  const snapPoints = useMemo(() => [200], []);
  const [currentAlign, currentAlignSet] = useState((align || 'left') as any);
  // const currentAlign = useMemo(align);
  const _currentAlignSet = (val: string) => {
    currentAlignSet(val);
    // console.log(val);
    changeValue('align', val);
  };
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        enableTouchThrough={true}
        onPress={() => modalRef.current?.dismiss()}
      />
    ),
    [],
  );
  // console.log('align:', activeIndex, align, objList);

  useEffect(() => {
    if (align !== currentAlign) {
      // console.log('align !== currentAlign:', align, currentAlign);
      currentAlignSet(align);
    }
  }, [currentAlign]);

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
      enableHandlePanningGesture={false}>
      <View style={style.modalHeaderWrap}>
        <Text variant="titleMedium">간격</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      <View style={style.contentsWrap}>
        <Pressable onPress={() => _currentAlignSet('left')}>
          <FImage
            style={styles.icon36}
            source={
              align === 'left'
                ? images.icon_align_left_on
                : images.icon_align_left_off
            }
          />
        </Pressable>
        <Pressable onPress={() => _currentAlignSet('center')}>
          <FImage
            style={styles.icon36}
            source={
              align === 'center'
                ? images.icon_align_middle_on
                : images.icon_align_middle_off
            }
          />
        </Pressable>
        <Pressable onPress={() => _currentAlignSet('right')}>
          <FImage
            style={styles.icon36}
            source={
              align === 'right'
                ? images.icon_align_right_on
                : images.icon_align_right_off
            }
          />
        </Pressable>
      </View>
    </BottomSheetModal>
  );
};
const style = StyleSheet.create({
  bg: {backgroundColor: '#0c0c10'},
  handle: {display: 'none'},
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
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  track: {
    height: 16,
    borderRadius: 16,
    backgroundColor: '#c4c4c4',
  },
  thumb: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderColor: '#5794ff',
    borderWidth: 4,
    borderRadius: 16,
  },
  thumbText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default AlignModal;
