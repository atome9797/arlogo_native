import React from 'react';
import {View, Image, Pressable, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import styles from '../../utils/styles';
import {
  requestMultiple,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import Modal from 'react-native-modal';
import images from '../../utils/images';
import {deviceSize, isIos} from '../../utils/libs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FImage from '../common/fimage';

const PermissionModal = ({hasPermissionSet}) => {
  const insets = useSafeAreaInsets();
  const permissionRequest = () => {
    let _checked = true;
    if (isIos) {
      requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        // PERMISSIONS.IOS.MEDIA_LIBRARY,
      ]).then(statuses => {
        _checked =
          statuses['ios.permission.CAMERA'] === 'granted' ||
          // statuses['ios.permission.MEDIA_LIBRARY'] === 'granted' ||
          statuses['ios.permission.PHOTO_LIBRARY'] === 'granted';
        console.log('permissionRequest _checked', _checked);
        hasPermissionSet(_checked);
        if (
          Object.values(statuses).filter(item => item === 'denied').length > 0
        ) {
          openSettings().catch(() => console.warn('cannot open settings'));
        }
      });
    } else {
      requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ]).then(statuses => {
        _checked =
          statuses['android.permission.CAMERA'] === 'granted' ||
          statuses['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' ||
          statuses['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted';
        console.log('permissionRequest _checked', _checked);
        hasPermissionSet(_checked);
        if (
          Object.values(statuses).filter(item => item === 'denied').length > 0
        ) {
          openSettings().catch(() => console.warn('cannot open settings'));
        }
      });
    }
  };
  return (
    <View style={style.container}>
      <View style={style.modalViewWrap}>
        <View style={[style.inner, styles.flexcc]}>
          <FImage style={style.biWrap} source={images.logo_512} />
          <Text style={style.topTitleTxt}>ARlogo 앱 접근 권한 안내</Text>
          {/* <Text style={style.topDescTxt}>버전 1.2.3에서 액세스할 수 있음</Text> */}
        </View>
        <View style={[style.inner, {justifyContent: 'center', flex: 0.4}]}>
          <View style={[styles.rowsc, {flex: 0.5}]}>
            <View style={{paddingHorizontal: 20}}>
              <FImage
                source={images.icon_permission_file}
                style={styles.icon44}
              />
            </View>
            <View>
              <Text style={[style.text14bold, {marginBottom: 10}]}>
                저장공간 (필수)
              </Text>
              <Text style={style.midDescTxt}>
                앱 구동에 필요한 파일 저장 및{'\n'}로고 이미지 저장
              </Text>
            </View>
          </View>
          <View style={[styles.rowsc, {flex: 0.5}]}>
            <View style={{paddingHorizontal: 20}}>
              <FImage
                source={images.icon_permission_camera}
                style={styles.icon44}
              />
            </View>
            <View>
              <Text style={[style.text14bold, {marginBottom: 10}]}>
                카메라 (필수)
              </Text>
              <Text style={style.midDescTxt}>
                기기 카메라 사용 {'\n'}
                (3D/AR 시뮬레이션 진행)
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            style.inner,
            {justifyContent: 'space-between', borderBottomWidth: 0},
          ]}>
          <View style={{marginTop: 20}}>
            <Text style={{color: '#fff', marginBottom: 12}}>
              · 접근 권한 변경 방법
            </Text>
            <Text
              style={
                style.bottomDescTxt
              }>{`설정 > 개인정보보호 > 권한 > ARlogo 앱`}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#888', fontSize: 12, marginBottom: 32}}>
              위 사용 권한은 해당 기능 사용 시 동의를 받고 있으며,{'\n'}
              미동의 시 일부 기능 사용에 제한이 있을 수 있습니다.
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={() => permissionRequest()}
        style={[
          style.bottomButton,
          insets.bottom > 0 && {paddingBottom: insets.bottom},
        ]}>
        <Text style={style.text16bold}>확인</Text>
      </Pressable>
    </View>
  );
};

export default PermissionModal;
const style = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: deviceSize.width,
    height: deviceSize.height,
    zIndex: 999,
  },
  biWrap: {
    width: 44,
    height: 44,
    backgroundColor: '#25262b',
    borderRadius: 20,
  },
  topTitleTxt: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  topDescTxt: {color: '#c4c4c4', fontSize: 12},
  midDescTxt: {
    color: '#c4c4c4',
    fontSize: 14,
    lineHeight: 14 * 1.57,
  },
  bottomDescTxt: {
    color: '#888',
    fontSize: 12,
    marginLeft: 10,
  },
  modalWrap: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  modalViewWrap: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0c0c10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 0.3,
    borderBottomColor: '#25262b',
    borderBottomWidth: 1,
    width: '100%',
  },
  bottomButton: {
    backgroundColor: '#5794ff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 22,
  },
  text14bold: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text16bold: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
