import React, {ReactElement} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Image, StyleSheet, Text, View, Linking} from 'react-native';
import {currentVersion, currentBuildNumber, toast} from '../../utils/libs';
import {List} from 'react-native-paper';
import images from '../../utils/images';
import FImage from '../../component/common/fimage';
import DeviceInfo from 'react-native-device-info';

const DrawerScreen = (props: any): ReactElement => {
  return (
    <DrawerContentScrollView {...props} style={{backgroundColor: '#25262b'}}>
      <View style={{padding: 20}}>
        <View style={style.logoArea}>
          <FImage
            style={{width: 50, height: 50, marginRight: 16, borderRadius: 20}}
            source={images.logo_512}
          />
          <Text style={{color: '#888888'}}>AR logo</Text>
        </View>
        <List.Item
          title="버전정보"
          // description={`(최신버전 ${currentVersion})\n${currentBuildNumber}`}
          description={`(최신버전 ${currentVersion})`}
          right={() => (
            <View style={{justifyContent: 'center'}}>
              <Text style={{color: '#fff', fontSize: 18}}>
                {currentVersion}
              </Text>
            </View>
          )}
          titleStyle={style.itemText}
          descriptionStyle={{color: '#888888'}}
        />
        <List.Item
          title="로고 제작 문의하기"
          // right={listProps => <List.Icon {...listProps} icon="chevron-right" />}
          onPress={async () => {
            let deviceId = DeviceInfo.getDeviceId();
            let systemName = DeviceInfo.getSystemName();
            let systemVersion = DeviceInfo.getSystemVersion();
            let version = DeviceInfo.getVersion();
            let model = DeviceInfo.getModel() || deviceId;
            let _body = `\n\n\nOS정보 : ${systemName} ${systemVersion}\n기기정보 : ${model}\n앱정보 : ${version}`;

            let _title = '[ARlogo] 로고 제작 문의하기';
            let url = `mailto:arlogo@uxstory.co.kr?subject=${_title}&body=${_body}`;
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              Linking.openURL(url);
            } else {
              toast('이메일 앱이 없습니다.', 80);
            }
          }}
          titleStyle={style.itemText}
        />
        <List.Item
          title="문의하기"
          // right={listProps => <List.Icon {...listProps} icon="chevron-right" />}
          onPress={async () => {
            let deviceId = DeviceInfo.getDeviceId();
            let systemName = DeviceInfo.getSystemName();
            let systemVersion = DeviceInfo.getSystemVersion();
            let version = DeviceInfo.getVersion();
            let model = DeviceInfo.getModel() || deviceId;
            let _body = `\n\n\nOS정보 : ${systemName} ${systemVersion}\n기기정보 : ${model}\n앱정보 : ${version}`;
            let _title = '[ARlogo] 문의하기';
            let url = `mailto:arlogo@uxstory.co.kr?subject=${_title}&body=${_body}`;
            // Linking.openURL(url).catch(() => console.warn('이메일 앱이 없음.'));
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              Linking.openURL(url);
            } else {
              // console.log('이메일 앱이 없음.');
              // Toast.show('이메일 앱이 없습니다.');
              toast('이메일 앱이 없습니다.', 80);
            }
          }}
          titleStyle={style.itemText}
        />
        <List.Item
          title="이용약관"
          // right={listProps => <List.Icon {...listProps} icon="chevron-right" />}
          onPress={() => props.navigation.navigate('TermsScreen')}
          titleStyle={style.itemText}
        />
        <List.Item
          title="개인정보처리방침"
          // right={listProps => <List.Icon {...listProps} icon="chevron-right" />}
          onPress={() => props.navigation.navigate('PrivacyScreen')}
          titleStyle={style.itemText}
        />
      </View>
    </DrawerContentScrollView>
  );
};
const style = StyleSheet.create({
  logoArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomColor: '#31333c',
    borderBottomWidth: 1,
  },
  itemText: {
    color: '#f0f0f0',
    fontSize: 14,
  },
});
export default DrawerScreen;
