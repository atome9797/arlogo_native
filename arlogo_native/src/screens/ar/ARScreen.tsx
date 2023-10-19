import React, {useRef, useEffect, useState} from 'react';
import ScreenContainer from '../../component/ScreenContainer';
import { View, Dimensions, StyleSheet} from 'react-native';
import UnityView from '@azesmway/react-native-unity';
import FImage from '../../component/common/fimage';
import styles from '../../utils/styles';
import images from '../../utils/images';
import store from '../../../src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IMessage {
  gameObject: string;
  methodName: string;
  message: string;
}


const ARScreen = ({navigation, route}: any) => {

  const {params} = route;
  const {target, LogoImage, Thumbnail, loadJson} = params;

  const unityRef = useRef<UnityView>(null);
  //const {width, height} = Dimensions.get('window');

  //3D 데이터 추가

  useEffect(() => {
    if (unityRef?.current) {
      
      console.log(" unity : " , unityRef?.current)
      console.log("LogoImage : ",LogoImage)
      console.log("Thumbnail : ",Thumbnail)
      console.log("target : ", target)
      console.log("loadJson : ",loadJson)

      console.log('param total', params)

      const message: IMessage = {
        gameObject: 'RNManager',
        methodName: 'SetItem',
        message: JSON.stringify(params),
      };
      unityRef.current.postMessage(message.gameObject, message.methodName, message.message);
    }
  }, []);

  

  //jsonData 
  //1. 썸네일 주소
  //2. 로고 이미지 주소
  //3. 로고좌표
  //4. 도형 타입
  //5. 도형 좌표    

  //onUnityMessage 는 unity에서 RN 으로 메세지를 받을 때 사용한다. 
  //style={{width: width, height: height}}
  return (
    <ScreenContainer>
      <View style={style.container}>
        <UnityView
          ref={unityRef}
          style={style.wrapper}
          onUnityMessage={(result) => {
            console.log('onUnityMessage', result.nativeEvent.message)
            if(result.nativeEvent.message === 'stop')
            {
              navigation?.goBack();
            }
            else
            {
              AsyncStorage.setItem('unityStorage',result.nativeEvent.message, () => {
                console.log('유니티 데이터 저장 완료')
              });
            }
            
          }}
        />
      </View>
      
    </ScreenContainer>
  );
};

export default ARScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  wrapper: {
    flex: 1,
  },
});