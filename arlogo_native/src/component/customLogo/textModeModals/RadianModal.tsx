import React, {useCallback, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import images from '../../../utils/images';
// import Slider from 'react-native-slider';
import {Slider} from '@miblanchard/react-native-slider';
import styles from '../../../utils/styles';
import useStores from '../../../store/useStores';
import FImage from '../../common/fimage';

const RadianModal = ({
  changeValue,
  modalRef,
  currentValue,
  activeIndex,
}: any) => {
  const {store} = useStores();
  const snapPoints = useMemo(() => [200], []);
  const [radian, radianSet] = useState((currentValue || 0) as any);
  // console.log('radian:', radian);
  // const _radianSet = val => {
  //   const value = val[0].toFixed(0);
  //   radianSet(value);
  //   console.log(value);
  //   store.setSliderValues({key: activeIndex, radian: value});
  // };
  // const _radianSetComplete = val => {
  //   const value = val[0].toFixed(0);
  //   changeValue('radian', value);
  //   store.setSliderValues({});
  // };
  const _radianSet = (val: any, isDone: boolean) => {
    const value = val[0].toFixed(0);
    radianSet(value);
    changeValue('radian', value, isDone);
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
        <Text variant="titleMedium">라디안</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      <View style={style.contentsWrap}>
        <Slider
          value={radian}
          onValueChange={val => _radianSet(val, false)}
          onSlidingComplete={val => _radianSet(val, true)}
          // onSlidingComplete={_radianSetComplete}
          minimumValue={-100}
          maximumValue={100}
          step={1}
          trackStyle={style.track}
          thumbStyle={style.thumb}
          minimumTrackTintColor="#5794ff"
          maximumTrackTintColor="#c4c4c4"
          thumbTouchSize={{width: 20, height: 20}}
          renderAboveThumbComponent={() => (
            <Text style={style.thumbText}>{radian}</Text>
          )}
        />
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
    alignItems: 'stretch',
    justifyContent: 'center',
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
export default RadianModal;
