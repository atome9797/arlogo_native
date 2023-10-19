import React, {useEffect} from 'react';

import {View, StyleSheet, Image, Pressable, StatusBar} from 'react-native';
import {Text} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import ScreenContainer from '../../component/ScreenContainer';
import useStores from '../../store/useStores';
import styles from '../../utils/styles';
import images from '../../utils/images';
import RNExitApp from 'react-native-exit-app';
import FImage from '../../component/common/fimage';
import {isIos} from '../../utils/libs';
const Container = ({children}) => {
  if (isIos) {
    return (
      <View style={styles.flex1}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        {children}
      </View>
    );
  } else {
    return <ScreenContainer>{children}</ScreenContainer>;
  }
};
const Network = () => {
  const {store} = useStores();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      store.setNetworkStatus(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, [store]);
  return (
    <Container>
      <View style={styles.flex1}>
        <View style={style.container}>
          <FImage source={images.icon_alert} style={styles.icon44} />
          <Text style={style.titleText}>네트워크 에러</Text>
          <Text style={style.subText}>
            서버와의 통신이 원활하지 않습니다.{'\n'}
            네트워크 연결상태를 확인하시거나{'\n'}
            잠시 후 다시 시도해 주세요.
          </Text>
          <View style={styles.rowcc}>
            <Pressable
              style={style.button}
              onPress={() => {
                RNExitApp.exitApp();
              }}>
              <Text style={style.buttonText}>앱종료</Text>
            </Pressable>
            {/* <Pressable
              style={[style.button, style.buttonR]}
              onPress={() => {
                console.log('asdf');
              }}>
              <Text style={style.buttonText}>재시도</Text>
            </Pressable> */}
          </View>
        </View>
      </View>
    </Container>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    lineHeight: 14 * 1.43,
    color: '#888888',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#54565c',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonR: {
    backgroundColor: '#5794ff',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'NanumBarunGothic',
  },
});

export default Network;
