import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import images from '../../../utils/images';
import styles from '../../../utils/styles';
import FImage from '../../common/fimage';

// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const FlipModal = ({changeValue, modalRef, currentValue}: any) => {
  const snapPoints = useMemo(() => [200], []);
  // const [currentAlign, currentAlignSet] = useState((align || 'left') as any);
  // const currentAlign = useMemo(align);
  // console.log('currentValue:', currentValue);

  const _currentFlip = (val: string) => {
    const value =
      val === 'x'
        ? [currentValue[0] * -1, currentValue[1]]
        : [currentValue[0], currentValue[1] * -1];
    // console.log('value:', value);
    changeValue(value);
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
        <Text variant="titleMedium">뒤집기</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      <View style={style.contentsWrap}>
        <Pressable
          onPress={() => _currentFlip('y')}
          style={[styles.flexcc, {marginRight: 80}]}>
          <FImage style={styles.icon40} source={images.icon_horizontal_flip} />
          <Text style={style.iconText}>수평 뒤집기</Text>
        </Pressable>
        <Pressable onPress={() => _currentFlip('x')} style={styles.flexcc}>
          <FImage style={styles.icon40} source={images.icon_verticality_flip} />
          <Text style={style.iconText}>수직 뒤집기</Text>
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
    justifyContent: 'center',
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
  iconText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
});
export default FlipModal;
