import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import images from '../../utils/images';
import {deviceSize} from '../../utils/libs';
import FImage from '../common/fimage';
import {DismissKeyboardView} from '../DismissKeyboardView';

const EditModeBottom = ({
  currentMode,
  currentModeSet,
  allSelectedDisable,
  setActiveIndex,
}: any) => {
  return (
    <DismissKeyboardView>
      <View style={style.bottomModalWrap}>
        <Pressable
          onPress={() => {
            currentModeSet((prev: string) => (prev === 'text' ? '' : 'text'));
            allSelectedDisable();
          }}
          style={[
            style.bottomModalInnerItem,
            currentMode === 'text' && style.activeColor,
          ]}>
          <FImage
            style={style.bottomModalInnerImage}
            source={
              currentMode === 'text' ? images.icon_text_s : images.icon_text_w
            }
          />
          <Text style={{color: currentMode === 'text' ? '#5794ff' : '#fff'}}>
            텍스트
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            currentModeSet((prev: string) =>
              prev === 'symbol' ? '' : 'symbol',
            );
            allSelectedDisable();
          }}
          style={[
            style.bottomModalInnerItem,
            currentMode === 'symbol' && style.activeColor,
          ]}>
          <FImage
            style={style.bottomModalInnerImage}
            source={
              currentMode === 'symbol'
                ? images.icon_symbol_s
                : images.icon_symbol_w
            }
          />
          <Text style={{color: currentMode === 'symbol' ? '#5794ff' : '#fff'}}>
            심볼
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            currentModeSet((prev: string) => (prev === 'bg' ? '' : 'bg'));
            allSelectedDisable();
            // setActiveIndex(0);
          }}
          style={[
            style.bottomModalInnerItem,
            currentMode === 'bg' && style.activeColor,
          ]}>
          <FImage
            style={style.bottomModalInnerImage}
            source={currentMode === 'bg' ? images.icon_bg_s : images.icon_bg_w}
          />
          <Text style={{color: currentMode === 'bg' ? '#5794ff' : '#fff'}}>
            배경
          </Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
};
const style = StyleSheet.create({
  bottomModalWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    // backgroundColor: 'red',
    backgroundColor: '#0c0c10',
    zIndex: 100,
  },
  bottomModalInnerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceSize.width / 3,
    borderTopColor: '#222',
    borderTopWidth: 1,
    height: '100%',
  },
  activeColor: {
    borderTopColor: '#5794ff',
  },
  bottomModalInnerImage: {
    width: 24,
    height: 24,
    marginBottom: 0,
  },
});
export default EditModeBottom;
