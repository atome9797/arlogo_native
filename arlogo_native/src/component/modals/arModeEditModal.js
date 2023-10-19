import React from 'react';
import {View, Image, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import images from '../../utils/images';
import styles from '../../utils/styles';
import Modal from 'react-native-modal';

const ArModeEditModal = ({exitModal, exitModalSet, navigation, store}) => {
  return (
    <Modal
      isVisible={exitModal}
      backdropTransitionOutTiming={0}
      style={styles.modalStyle}
      onBackdropPress={() => exitModalSet(false)}>
      <View style={styles.modalViewWrap}>
        <Text style={styles.modalHeaderText}>
          AR 시뮬레이션을 종료 하시겠습니까?
        </Text>
        <View style={styles.modalButtonWrap}>
          <Pressable
            onPress={() => {
              exitModalSet(false);
            }}
            style={styles.modalButtonLeft}>
            <Text style={styles.modalButtonLeftText}>취소</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              store.setArInitialized(false);
              navigation?.goBack();
            }}
            style={styles.modalButtonRight}>
            <Text style={styles.modalButtonRightText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
export default ArModeEditModal;
