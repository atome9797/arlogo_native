import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useRef} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Toast from 'react-native-root-toast';
import images from '../../utils/images';
import {toast} from '../../utils/libs';
import FImage from '../common/fimage';
import AddSymbolModal from './symbolModeModals/AddSymbolModal';
// import AddSymboldModal from './symbolModeModals/AddSymboldModal';
import FlipModal from './symbolModeModals/FlipModal';
import ColorModal from './textModeModals/ColorModal';
import OpacityModal from './textModeModals/OpacityModal';

const EditModeSubSymbol = ({
  editObjValueByActiveIndex,
  activeIndex,
  objList,
  bringToBack,
  bringToFront,
  duplicateItem,
  addNewSymbol,
}: any) => {
  const changeColor = (item: any) => {
    editObjValueByActiveIndex('color', item);
  };
  const changeGradientType = (item: any) => {
    editObjValueByActiveIndex('gradientType', item);
  };
  const addSymbolModalRef = useRef<BottomSheetModal>(null);
  const colorModalRef = useRef<BottomSheetModal>(null);
  const flipModalRef = useRef<BottomSheetModal>(null);
  const opacityModalRef = useRef<BottomSheetModal>(null);
  const checkActiveIndex = () => {
    if (!activeIndex) {
      // Toast.show('아이템을 선택해주세요.');
      toast('아이템을 선택해주세요.', 150);
      return false;
    }
    const type = objList.filter(item => item.key === activeIndex)[0]?.type;
    if (type !== 'symbol') {
      // Toast.show('텍스트 아이템을 선택해주세요.');
      toast('심볼 아이템을 선택해주세요.', 150);
      return false;
    }
    return true;
  };
  const getObjListByKey = (prop: any) => {
    if (!activeIndex) return '';
    const targetArr = objList.filter(item => item.key === activeIndex);
    let result = (targetArr.length && targetArr[0][prop]) || '';
    // if (prop === 'color') {
    //   result = result.split(',')[0];
    // }
    return result;
    // return (targetArr.length && targetArr[0][prop]) || '';
  };
  const itemList = [
    {
      text: '심볼 추가',
      source: images.icon_add_symbol,
      onPress: () => {
        if (objList.filter(item => item.type === 'symbol').length >= 10) {
          toast('심볼은 최대 10개까지 추가 가능합니다.', 150);
          return false;
        }
        addSymbolModalRef.current?.present();
      },
    },
    {
      text: '색상',
      source: images.icon_tcolor,
      onPress: () => {
        checkActiveIndex() && colorModalRef.current?.present();
      },
    },
    {
      text: '복제',
      source: images.icon_text_copy,
      onPress: () => {
        checkActiveIndex() && duplicateItem();
      },
    },
    {
      text: '뒤집기',
      source: images.icon_flip,
      onPress: () => {
        checkActiveIndex() && flipModalRef.current?.present();
      },
    },
    {
      text: '투명도',
      source: images.icon_opacity,
      onPress: () => {
        checkActiveIndex() && opacityModalRef.current?.present();
      },
    },
    {
      text: '회전',
      source: images.icon_rotate_w,
      onPress: () => {
        let _angle = getObjListByKey('angle') * 1 + 90;
        if (_angle >= 360) {
          _angle -= 360;
        }
        checkActiveIndex() && editObjValueByActiveIndex('angle', _angle);
      },
    },
    {
      text: '뒤로\n보내기',
      source: images.icon_backward,
      onPress: () => {
        checkActiveIndex() && bringToBack();
      },
    },
    {
      text: '앞으로\n가져오기',
      source: images.icon_farward,
      onPress: () => {
        checkActiveIndex() && bringToFront();
      },
    },
  ];
  return (
    <View style={[style.modalContent]}>
      <ScrollView style={{height: 80}} horizontal>
        <View style={style.itemsInnerWrap}>
          {itemList.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={style.itemsInnerButton}>
              <FImage
                style={style.bottomModalInnerImage}
                source={item.source}
              />
              <Text style={style.iconText}>{item.text}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <ColorModal
        key={`ColorModal${activeIndex}`}
        changeColor={changeColor}
        changeGradientType={changeGradientType}
        modalRef={colorModalRef}
        selectedColor={getObjListByKey('color')}
        type="symbol"
      />
      <FlipModal
        key={`FlipModal${activeIndex}`}
        changeValue={(value: any) => editObjValueByActiveIndex('flip', value)}
        modalRef={flipModalRef}
        currentValue={getObjListByKey('flip')}
      />
      <OpacityModal
        key={`OpacityModal${activeIndex}`}
        changeValue={(value: any) =>
          editObjValueByActiveIndex('opacity', value)
        }
        modalRef={opacityModalRef}
        activeIndex={activeIndex}
        currentValue={getObjListByKey('opacity')}
      />
      <AddSymbolModal
        key={`AddSymboldModal${activeIndex}`}
        changeValue={(name: string, color: string) => addNewSymbol(name, color)}
        modalRef={addSymbolModalRef}
      />
    </View>
  );
};
const style = StyleSheet.create({
  modalContent: {
    // height: 80,
    // flex: 1,
    width: '100%',
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
  iconText: {color: '#fff', textAlign: 'center'},
});
export default EditModeSubSymbol;
