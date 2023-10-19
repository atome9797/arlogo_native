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
// import {useLogoContext} from '../../../screens/customLogo/hooks/useLogoContext';

const OpacityModal = ({
  changeValue,
  modalRef,
  currentValue,
  activeIndex,
}: any) => {
  const snapPoints = useMemo(() => [200], []);
  const [opacity, opacitySet] = useState(((currentValue || 1) * 100) as any);
  // const {opacityValue} = useLogoContext();
  const {store} = useStores();
  // console.log('opacity:', opacity);
  const onValueChange = val => {
    opacitySet(val);
    const _opacity = val[0] === 0 ? 0 : val[0] / 100;
    store.setSliderValues({key: activeIndex, opacityValue: _opacity});
  };
  const onSlidingComplete = val => {
    const _opacity = val[0] === 0 ? 0 : val[0] / 100;
    changeValue(_opacity);
    store.setSliderValues({});
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
        <Text variant="titleMedium">투명도</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      <View style={style.contentsWrap}>
        <Slider
          value={opacity}
          onSlidingComplete={onSlidingComplete}
          onValueChange={onValueChange}
          minimumValue={0}
          maximumValue={100}
          step={1}
          trackStyle={style.track}
          thumbStyle={style.thumb}
          minimumTrackTintColor="#5794ff"
          maximumTrackTintColor="#c4c4c4"
          thumbTouchSize={{width: 20, height: 20}}
          renderAboveThumbComponent={() => (
            <Text style={style.thumbText}>{opacity}</Text>
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
export default OpacityModal;
