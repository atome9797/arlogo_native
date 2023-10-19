import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import images from '../../../utils/images';
import styles from '../../../utils/styles';
import {addSymbolList} from '../../../utils/addSymbolList';
import {deviceSize} from '../../../utils/libs';
import FImage from '../../common/fimage';

const symbolList = [
  '기본',
  '틀',
  '자연',
  '스포츠',
  '동물',
  '음식',
  '쇼핑',
  '교육',
  '비즈니스',
  '게임',
  '건강',
  '여행',
  '건축',
];
const AddSymbolModal = ({changeValue, modalRef, currentValue}: any) => {
  const snapPoints = useMemo(() => ['50%'], []);
  const scrollContentRef = useRef(null);
  // const [currentAlign, currentAlignSet] = useState((align || 'left') as any);
  // const currentAlign = useMemo(align);
  // console.log('currentValue:', currentValue);
  const [selectedSymbol, selectedSymbolSet] = useState(symbolList[0] as any);
  const [selectedSymbolItems, selectedSymbolItemsSet] = useState(
    addSymbolList[selectedSymbol] || [],
  );
  // const _currentFlip = (val: string) => {
  //   const value =
  //     val === 'x'
  //       ? [currentValue[0] * -1, currentValue[1]]
  //       : [currentValue[0], currentValue[1] * -1];
  //   // console.log('value:', value);
  //   changeValue(value);
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
  // console.log(selectedSymbolItems, selectedSymbolItems.length);
  // console.log(selectedSymbolItems);
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
        <Text variant="titleMedium">심볼</Text>
        <Pressable onPress={() => modalRef.current?.dismiss()}>
          <FImage style={styles.icon24} source={images.icon_close_gray} />
        </Pressable>
      </View>
      <View style={style.symbolContainer}>
        <View style={style.scrollLeft}>
          <BottomSheetScrollView contentContainerStyle={[style.bg]}>
            <View style={{flex: 1, alignItems: 'center'}}>
              {symbolList.map((item, index) => (
                <Pressable
                  onPress={() => {
                    selectedSymbolSet(item);
                    selectedSymbolItemsSet(addSymbolList[item]);
                    scrollContentRef?.current?.scrollTo({
                      x: 0,
                      y: 0,
                      animated: false,
                    });
                  }}
                  style={style.categoryWrap}
                  key={index}>
                  <Text
                    style={[
                      style.categoryText,
                      item === selectedSymbol && style.categoryTextActive,
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </BottomSheetScrollView>
        </View>
        <View style={styles.flex1}>
          <BottomSheetScrollView
            ref={scrollContentRef}
            contentContainerStyle={[style.bg]}>
            <View style={style.categoryContentWrap}>
              {selectedSymbolItems?.length > 0 &&
                selectedSymbolItems.map((item, index) => {
                  const Comp = Object.values(item)[0];
                  const name = Object.keys(item)[0];
                  const size = (deviceSize.width - 156) / 3;
                  return (
                    <Pressable
                      onPress={() => {
                        changeValue(name, `#fff`);
                        modalRef.current?.dismiss();
                        console.log('name:', name);
                      }}
                      key={index}
                      style={style.symbolButton}>
                      <Comp width={size} height={size} fill={`#fff`} />
                    </Pressable>
                  );
                })}
            </View>
          </BottomSheetScrollView>
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
  symbolContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  scrollLeft: {width: 84},
  symbolButton: {
    marginRight: 10,
    marginBottom: 10,
    padding: 7,
  },
  categoryWrap: {
    width: '100%',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    marginVertical: 12,
    color: '#888',
  },
  categoryTextActive: {
    color: '#5794ff',
  },
  categoryContentWrap: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
});
export default AddSymbolModal;
