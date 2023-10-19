import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import FImage from '../../component/common/fimage';
import ScreenContainer from '../../component/ScreenContainer';
import images from '../../utils/images';
import {deviceSize} from '../../utils/libs';

const imageList = [
  {uri: images.privacy1, width: 960, height: 1605},
  {uri: images.privacy2, width: 960, height: 1800},
  {uri: images.privacy3, width: 960, height: 1383},
  {uri: images.privacy4, width: 960, height: 1800},
  {uri: images.privacy5, width: 960, height: 1629},
  {uri: images.privacy6, width: 960, height: 1629},
  {uri: images.privacy7, width: 960, height: 1560},
  {uri: images.privacy8, width: 960, height: 1758},
  {uri: images.privacy9, width: 960, height: 1800},
  {uri: images.privacy10, width: 960, height: 1563},
  {uri: images.privacy11, width: 960, height: 1800},
  {uri: images.privacy12, width: 960, height: 1545},
  {uri: images.privacy13, width: 960, height: 1437},
];

const PrivacyScreen = () => {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={style.container}>
        <View style={style.wrapper}>
          {imageList.map((item, index) => (
            <FImage
              key={index}
              source={item.uri}
              style={{
                width: deviceSize.width - 40,
                height: (item.height * (deviceSize.width - 40)) / item.width,
              }}
            />
          ))}
        </View>
      </ScrollView>
      {/* <WebView
        source={{uri: 'http://uxstory.co.kr/privacy/'}}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        // style={style.container}
        // style={{backgroundColor: 'red'}}
      /> */}
    </ScreenContainer>
  );
};

export default PrivacyScreen;
const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 100,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 50,
  },
});
