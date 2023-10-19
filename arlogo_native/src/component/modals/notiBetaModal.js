import React from 'react';
import {View, Image, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import images from '../../utils/images';
import styles from '../../utils/styles';
import Modal from 'react-native-modal';
import FImage from '../common/fimage';

const NotiBetaModal = ({betaModal, betaModalSet}) => {
  return (
    <Modal
      isVisible={betaModal}
      backdropTransitionOutTiming={0}
      style={styles.modalStyle}
      animationIn="fadeIn"
      animationOut="fadeOut"
      // onBackdropPress={() => betaModalSet(false)}
    >
      <View style={styles.modalViewWrap}>
        <View style={{marginVertical: 24, alignItems: 'center'}}>
          <FImage
            style={[styles.icon44, {marginBottom: 20}]}
            source={images.icon_alert}
          />
          <Text style={[styles.modalHeaderText, {marginVertical: 0}]}>
            서비스 정식 오픈 후 사용하실 수 있습니다.{'\n'}
            조금만 기다려주세요.
          </Text>
        </View>
        <View style={styles.modalButtonWrap}>
          <Pressable
            onPress={() => {
              betaModalSet(false);
            }}
            style={styles.modalButtonLeft}>
            <Text style={styles.modalButtonRightText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
export default NotiBetaModal;
