import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useRef} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import images from '../../utils/images';
import FImage from '../common/fimage';
import RatioModal from './bgModeModals/RatioModal';
import ColorModal from './textModeModals/ColorModal';

const EditModeSubBg = ({
  editObjValueByActiveIndex,
  activeIndex,
  objList,
}: any) => {
  const changeColor = (item: any) => {
    // console.log('changeColor:', item);
    editObjValueByActiveIndex('color', item);
  };
  const changeGradientType = (item: any) => {
    editObjValueByActiveIndex('gradientType', item);
  };
  const colorModalRef = useRef<BottomSheetModal>(null);
  const ratioModalRef = useRef<BottomSheetModal>(null);

  const getObjListByKey = (prop: any) => {
    if (activeIndex !== 0) return '';
    const targetArr = objList.filter(item => item.key === activeIndex);
    let result = (targetArr.length && targetArr[0][prop]) || '';
    return result;
    // return (targetArr.length && targetArr[0][prop]) || '';
  };
  // console.log('activeIndex:', activeIndex);
  return (
    <View style={[style.modalContent]}>
      <ScrollView style={{height: 80}} horizontal>
        <View style={style.itemsInnerWrap}>
          <Pressable
            onPress={() => {
              colorModalRef.current?.present();
            }}
            style={style.itemsInnerButton}>
            <FImage
              style={style.bottomModalInnerImage}
              source={images.icon_tcolor}
            />
            <Text style={{color: '#fff'}}>색상</Text>
          </Pressable>
        </View>
      </ScrollView>
      <ColorModal
        key={`ColorModal${activeIndex}`}
        changeColor={changeColor}
        changeGradientType={changeGradientType}
        modalRef={colorModalRef}
        selectedColor={getObjListByKey('color')}
        type="bg"
      />
      <RatioModal
        key={`RatioModal${activeIndex}`}
        modalRef={ratioModalRef}
        changeValue={(value: any) => editObjValueByActiveIndex('ratio', value)}
      />
    </View>
  );
};
const style = StyleSheet.create({
  modalContent: {
    // height: 80,
    // flex: 1,
    // width: '100%',
    backgroundColor: '#0c0c10',
    // backgroundColor: 'red',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    // position: 'absolute',
    // left: 0,
    // bottom: 57,
  },
  itemsInnerButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  bottomModalInnerImage: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  itemsInnerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
});
export default EditModeSubBg;
