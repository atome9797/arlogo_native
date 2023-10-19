import React, {useRef, useCallback, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {EditorTypes} from './textEditor/Editor/types';
import FontModal from './textModeModals/FontModal';

import {BottomSheetModal} from '@gorhom/bottom-sheet';
import images from '../../utils/images';
import ColorModal from './textModeModals/ColorModal';
// import SizeModal from './textModeModals/SizeModal';
import OpacityModal from './textModeModals/OpacityModal';
import Toast from 'react-native-root-toast';
import SpacingModal from './textModeModals/SpacingModal';
import AlignModal from './textModeModals/AlignModal';
import RadianModal from './textModeModals/RadianModal';
import useStores from '../../store/useStores';
import FImage from '../common/fimage';
import {toast} from '../../utils/libs';

const EditModeSubText = ({
  editObjValueByActiveIndex,
  addNewText,
  activeIndex,
  objList,
  duplicateItem,
  bringToBack,
  bringToFront,
}: any) => {
  const changeColor = (item: any) => {
    editObjValueByActiveIndex('color', item);
  };
  const changeGradientType = (item: any) => {
    editObjValueByActiveIndex('gradientType', item);
  };
  const {store} = useStores();
  const [currentValue, currentValueSet] = useState([]);
  const [tempW, tempWSet] = useState(0);
  const [tempH, tempHSet] = useState(0);
  const [currentText, currentTextSet] = useState(0);
  const fontModalRef = useRef<BottomSheetModal>(null);
  const colorModalRef = useRef<BottomSheetModal>(null);
  const opacityModalRef = useRef<BottomSheetModal>(null);
  const spacingModalRef = useRef<BottomSheetModal>(null);
  const aligngModalRef = useRef<BottomSheetModal>(null);
  const radianModalRef = useRef<BottomSheetModal>(null);
  const checkActiveIndex = () => {
    if (!activeIndex) {
      toast('아이템을 선택해주세요.', 150);
      // Toast.show('아이템을 선택해주세요.');
      return false;
    }
    const type = objList.filter(item => item.key === activeIndex)[0]?.type;
    if (type !== 'text' && type !== 'slogan') {
      toast('텍스트 아이템을 선택해주세요.', 150);
      // Toast.show('텍스트 아이템을 선택해주세요.');
      return false;
    }
    return true;
  };
  // console.log('objList[activeIndex]?.color:', objList, activeIndex);
  const getObjListByKey = (prop: any) => {
    if (!activeIndex) return '';
    const targetArr = objList.filter(item => item.key === activeIndex);
    let result = (targetArr.length && targetArr[0][prop]) || '';
    // console.log('result:', targetArr);
    return result;
    // return (targetArr.length && targetArr[0][prop]) || '';
  };
  // console.log('aligngModalRef.current:', aligngModalRef.current);
  const itemList = [
    {
      text: '텍스트 추가',
      source: images.icon_add_text,
      onPress: () => {
        addNewText();
      },
    },
    {
      text: '폰트',
      source: images.icon_font,
      onPress: () => {
        checkActiveIndex() && fontModalRef.current?.present();
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
      text: '투명도',
      source: images.icon_opacity,
      onPress: () => {
        checkActiveIndex() && opacityModalRef.current?.present();
      },
    },
    {
      text: '간격',
      source: images.icon_letterspacing,
      onPress: () => {
        checkActiveIndex() && spacingModalRef.current?.present();
        const h = getObjListByKey('h');
        const w = getObjListByKey('w');
        const letterSpacing = getObjListByKey('letterSpacing');
        const lineHeight = getObjListByKey('lineHeight');
        const fontSize = getObjListByKey('fontSize');
        const text = getObjListByKey('text');
        const currentTextArr = text.split('\n').map((t: string) => t.length);
        const line = text.split('\n').length;
        const oldMaxTextLength = Math.max(...currentTextArr);
        const _letterSpacing = fontSize * (letterSpacing / 100);
        const extWidth = _letterSpacing * (oldMaxTextLength - 1);
        let _w = w;
        if (letterSpacing > 0) {
          _w -= extWidth;
        } else if (letterSpacing < 0) {
          _w += extWidth * -1;
        }

        let _h = h;
        const heightPerLine = fontSize * (lineHeight / 100);
        const extHeight = heightPerLine * (line - 1);
        if (lineHeight > 0) {
          _h -= extHeight;
        } else if (lineHeight < 0) {
          _h += extHeight * -1;
        }
        tempHSet(_h);
        tempWSet(_w);
        currentTextSet(oldMaxTextLength);
      },
    },
    {
      text: '정렬',
      source: images.icon_paragraph,
      onPress: () => {
        checkActiveIndex() && aligngModalRef.current?.present();
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
      <FontModal
        key={`FontModal${activeIndex}`}
        changeValue={(prop: string, value: any) => {
          editObjValueByActiveIndex(prop, value);
          store.setResizeValues('wh', true);
        }}
        modalRef={fontModalRef}
        currentValue={getObjListByKey('fontFamily')}
      />
      <ColorModal
        key={`ColorModal${activeIndex}`}
        changeColor={changeColor}
        changeGradientType={changeGradientType}
        modalRef={colorModalRef}
        selectedColor={getObjListByKey('color')}
        type="text"
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
      <SpacingModal
        key={`SpacingModal${activeIndex}`}
        changeValue={(prop: string, value: any, isDone: boolean) => {
          // console.log('isDone:', isDone);
          const fontSize = getObjListByKey('fontSize');
          if (prop === 'letterSpacing') {
            const _letterSpacing = fontSize * (value / 100);
            const _w = tempW + _letterSpacing * (currentText - 1);
            if (!isDone) {
              let _val = {key: activeIndex} as any;
              _val[prop] = value;
              _val.w = _w;
              store.setSliderValues(_val);
              return;
            }
          }
          if (prop === 'lineHeight') {
            const line = getObjListByKey('text').split('\n').length;
            const heightPerLine = fontSize * (value / 100);
            const diffH = heightPerLine * (line - 1);
            const _h = tempH + diffH;
            if (!isDone) {
              let _val = {key: activeIndex} as any;
              _val[prop] = value;
              _val.h = _h;
              store.setSliderValues(_val);
              return;
            }
          }
          if (isDone) {
            editObjValueByActiveIndex(prop, value);
            // store.setSliderValues('done');
            store.setSliderValues({});
          }
        }}
        modalRef={spacingModalRef}
        activeIndex={activeIndex}
        text={getObjListByKey('text')}
        letterSpacing={getObjListByKey('letterSpacing')}
        lineHeight={getObjListByKey('lineHeight')}
      />
      <AlignModal
        key={`AlignModal${activeIndex}`}
        changeValue={(prop: string, value: any) =>
          editObjValueByActiveIndex(prop, value)
        }
        modalRef={aligngModalRef}
        align={getObjListByKey('align')}
        activeIndex={activeIndex}
        objList={objList}
      />
    </View>
  );
};
const style = StyleSheet.create({
  modalContent: {
    // flex: 1,
    backgroundColor: '#0c0c10',
    // backgroundColor: 'red',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#888',
  },
  iconText: {color: '#fff', textAlign: 'center'},
});
export default EditModeSubText;
