import React from 'react';
import {View, Image, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import images from '../../utils/images';
import styles from '../../utils/styles';
import Modal from 'react-native-modal';

const GotoMainModal = ({closeModal, closeModalSet, navigation}) => {
  return (
    <Modal
      isVisible={closeModal}
      backdropTransitionOutTiming={0}
      style={styles.modalStyle}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={() => closeModalSet(false)}>
      <View style={styles.modalViewWrap}>
        <Text style={styles.modalHeaderText}>
          메인 화면으로 이동 하시겠습니까?{'\n'}메인 화면 이동 시 입력한 내용은
          {'\n'}
          저장되지 않습니다.
        </Text>
        <View style={styles.modalButtonWrap}>
          <Pressable
            onPress={() => {
              closeModalSet(false);
            }}
            style={styles.modalButtonLeft}>
            <Text style={styles.modalButtonLeftText}>취소</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.popToTop();
            }}
            style={styles.modalButtonRight}>
            <Text style={styles.modalButtonRightText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
export default GotoMainModal;
