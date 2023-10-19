import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  Pressable,
  Image,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import images from '../../utils/images';
import FImage from '../common/fimage';
const StorageLogo = props => {
  const {modalVisible, setModalVisible} = props;
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
    }
  }, [props.modalVisible]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.bottomSheetContainer,
            transform: [{translateY: translateY}],
          }}
          {...panResponders.panHandlers}>
          <View style={{padding: 20}}>
            <Pressable onPress={closeModal} style={styles.closeWrap}>
              <FImage
                style={styles.imageWrap}
                source={images.icon_close_gray}
              />
            </Pressable>
            <View style={styles.contentsWrap}>
              <View style={styles.buttonWrap}>
                <Pressable onPress={() => console.log('false')}>
                  <FImage style={styles.imageWrap} source={images.icon_edit} />
                </Pressable>
                <Text style={styles.text}>편집</Text>
              </View>
              <View style={styles.buttonWrap}>
                <Pressable onPress={() => console.log('false')}>
                  <FImage style={styles.imageWrap} source={images.icon_save} />
                </Pressable>
                <Text style={styles.text}>내 보관함 저장</Text>
              </View>
              <View style={styles.buttonWrap}>
                <Pressable onPress={() => console.log('false')}>
                  <FImage
                    style={styles.imageWrap}
                    source={images.icon_download}
                  />
                </Pressable>
                <Text style={styles.text}>다운로드</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: 180,
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    backgroundColor: '#1f2024',
    // backgroundColor: 'blue',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeWrap: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginBottom: 20,
  },
  contentsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '33%',
  },
  imageWrap: {
    width: 24,
    height: 24,
  },
  text: {marginTop: 10, color: '#fff'},
});

export default StorageLogo;
