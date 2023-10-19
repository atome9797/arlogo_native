import React, {useCallback, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View, Text as RNText} from 'react-native';
import {Text} from 'react-native-paper';

import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import images from '../../../utils/images';
// import Slider from 'react-native-slider';
import {Slider} from '@miblanchard/react-native-slider';
import styles from '../../../utils/styles';
import useStores from '../../../store/useStores';
import FImage from '../../common/fimage';

const SpacingModal = ({
  changeValue,
  modalRef,
  letterSpacing,
  lineHeight,
  activeIndex,
  text,
}: any) => {
  const {store} = useStores();
  const snapPoints = useMemo(() => [200], []);
  const [currentLetterSpacing, letterSpacingSet] = useState(
    (letterSpacing || 0) as any,
  );
  const [currentLineHeight, lineHeightSet] = useState((lineHeight || 0) as any);

  const _letterSpacingSet = (val: any, isDone: boolean) => {
    letterSpacingSet(val);
    // store.setSliderValues({key: activeIndex, letterSpacing: val[0]});
    changeValue('letterSpacing', val[0], isDone);
  };
  const _lineHeightSet = (val: any, isDone: boolean) => {
    const value = val[0].toFixed(0);
    lineHeightSet(value);
    changeValue('lineHeight', value, isDone);
  };
  // const _lineHeightSetComplete = val => {
  //   const value = val[0].toFixed(0);
  // };
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
        <Text variant="titleMedium">간격</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      <View style={style.sliderWrap}>
        <View style={styles.rowsc}>
          <FImage style={styles.icon24} source={images.icon_letterSpacing2} />
          <View style={style.contentsWrap}>
            <Slider
              value={currentLetterSpacing}
              onValueChange={val => _letterSpacingSet(val, false)}
              onSlidingComplete={val => _letterSpacingSet(val, true)}
              minimumValue={-50}
              maximumValue={100}
              step={1}
              trackStyle={style.track}
              thumbStyle={style.thumb}
              minimumTrackTintColor="#5794ff"
              maximumTrackTintColor="#c4c4c4"
              thumbTouchSize={{width: 20, height: 20}}
              renderAboveThumbComponent={() => (
                <Text style={style.thumbText}>{currentLetterSpacing}</Text>
              )}
            />
          </View>
        </View>
        <View style={styles.rowsc}>
          <FImage style={styles.icon24} source={images.icon_lineHeight} />
          <View style={style.contentsWrap}>
            <Slider
              value={currentLineHeight}
              // onValueChange={_lineHeightSet}
              // onSlidingComplete={_lineHeightSetComplete}
              onValueChange={val => _lineHeightSet(val, false)}
              onSlidingComplete={val => _lineHeightSet(val, true)}
              minimumValue={-100}
              maximumValue={100}
              step={1}
              trackStyle={style.track}
              thumbStyle={style.thumb}
              minimumTrackTintColor="#5794ff"
              maximumTrackTintColor="#c4c4c4"
              thumbTouchSize={{width: 20, height: 20}}
              renderAboveThumbComponent={() => (
                <Text style={style.thumbText}>{currentLineHeight}</Text>
              )}
              disabled={text.split('\n').length === 1 ? true : false}
            />
          </View>
        </View>
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
  sliderWrap: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
export default SpacingModal;
