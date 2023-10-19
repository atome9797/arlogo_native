import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import images from '../../utils/images';
import {isIos, saveToMyStorage} from '../../utils/libs';
import NotiBetaModal from '../modals/notiBetaModal';
import SaveToStorage from '../modals/saveToStorage';
import GotoMainFromEditorModal from '../modals/gotoMainFromEditorModal';
import FImage from '../common/fimage';

const EditModeHeader = ({
  navigation,
  objList,
  symbolKey,
  undo,
  redo,
  clear,
  canUndo,
  canRedo,
  isNewKey,
  allSelectedDisable,
  manualCapture,
}: any) => {
  // console.log('history:', history?.length);
  const insets = useSafeAreaInsets();
  const [betaModal, betaModalSet] = useState(false);
  const [saveModal, saveModalSet] = useState(false);
  const [closeModal, closeModalSet] = useState(false);
  const [dataChanged, dataChangedSet] = useState(false);
  return (
    <View style={[style.headerArea, {marginTop: isIos ? 0 : insets.top}]}>
      <View style={style.fdr}>
        <Pressable
          onPress={() => {
            if (canUndo && !dataChanged) {
              allSelectedDisable();
              closeModalSet(true);
            } else {
              clear();
              navigation.navigate('Root', {
                dataChanged,
              });
            }
          }}
          style={style.headerIcon}>
          <FImage style={style.imageWrap} source={images.icon_home} />
        </Pressable>
        <Pressable
          onPress={() => {
            if (canUndo) {
              allSelectedDisable();
              undo();
            }
          }}
          style={style.headerIcon}>
          <FImage
            style={style.imageWrap}
            source={canUndo ? images.icon_undo_w : images.icon_undo_d}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            if (canRedo) {
              allSelectedDisable();
              redo();
            }
          }}
          style={style.headerIcon}>
          <FImage
            style={style.imageWrap}
            source={canRedo ? images.icon_redo_w : images.icon_redo_d}
          />
        </Pressable>
      </View>
      <View style={style.fdr}>
        <Pressable
          onPress={() => {
            console.log(objList)
            //allSelectedDisable();
            //saveModalSet(true);
          }}
          style={style.headerIcon}>
          <FImage style={style.imageWrap} source={images.icon_ar_w} />
        </Pressable>
        <Pressable
          onPress={() => {
            console.log(objList)
            allSelectedDisable();
            manualCapture();
          }}
          style={style.headerIcon}>
          <FImage style={style.imageWrap} source={images.icon_3d_w} />
        </Pressable>
        <Pressable
          onPress={() => {
            allSelectedDisable();
            saveModalSet(true);
          }}
          style={style.headerIcon}>
          <FImage style={style.imageWrap} source={images.icon_save} />
        </Pressable>
      </View>

      {/* 베타모달 */}
      <NotiBetaModal betaModal={betaModal} betaModalSet={betaModalSet} />

      {/* 내보관함에저장 */}
      <SaveToStorage
        saveModal={saveModal}
        saveModalSet={saveModalSet}
        saveToMyStorage={saveToMyStorage}
        symbolKey={symbolKey}
        isNewKey={isNewKey}
        objList={objList}
        dataChangedSet={dataChangedSet}
      />

      {/* 홈으로 이동 */}
      <GotoMainFromEditorModal
        closeModal={closeModal}
        closeModalSet={closeModalSet}
        navigation={navigation}
        clear={clear}
        dataChanged={dataChanged}
      />
    </View>
  );
};
const style = StyleSheet.create({
  headerArea: {
    height: 56,
    backgroundColor: '#0c0c10',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  imageWrap: {
    width: 24,
    height: 24,
  },
  image44: {
    width: 44,
    height: 44,
  },
  mr20: {marginRight: 20},
  headerIcon: {
    // backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  fdr: {flexDirection: 'row'},
});
export default EditModeHeader;
