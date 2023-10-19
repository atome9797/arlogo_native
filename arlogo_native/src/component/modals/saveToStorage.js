import React from 'react';
import {View, Image, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import images from '../../utils/images';
import styles from '../../utils/styles';
import Modal from 'react-native-modal';
import useStores from '../../store/useStores';
import FImage from '../common/fimage';

const SaveToStorage = ({
  saveModal,
  saveModalSet,
  saveToMyStorage,
  symbolKey,
  isNewKey,
  objList,
  dataChangedSet,
}) => {
  const {store} = useStores();
  return (
    <Modal
      isVisible={saveModal}
      backdropTransitionOutTiming={0}
      style={styles.modalStyle}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={() => saveModalSet(false)}>
      <View style={styles.modalViewWrap}>
        <View style={{marginVertical: 24, alignItems: 'center'}}>
          <FImage
            style={[styles.icon44, styles.mb20]}
            source={images.icon_saveToLibrary}
          />
          <Text style={[styles.modalHeaderText, {marginVertical: 0}]}>
            내 보관함에 저장 하시겠습니까?
          </Text>
        </View>
        <View style={styles.modalButtonWrap}>
          <Pressable
            onPress={() => {
              saveModalSet(false);
            }}
            style={styles.modalButtonLeft}>
            <Text style={styles.modalButtonLeftText}>취소</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              console.log("심볼릭 키 : " + symbolKey)
              const result = await saveToMyStorage(
                symbolKey,
                isNewKey,
                objList,
              );
              console.log('result:::', result);
              if (result) {
                dataChangedSet(true);
                store.setChangeStorage(true);
              }
              saveModalSet(false);
            }}
            style={styles.modalButtonRight}>
            <Text style={styles.modalButtonRightText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
export default SaveToStorage;
