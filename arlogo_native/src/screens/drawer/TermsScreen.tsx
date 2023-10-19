import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import FImage from '../../component/common/fimage';
import ScreenContainer from '../../component/ScreenContainer';
import images from '../../utils/images';
import {deviceSize} from '../../utils/libs';

const imageList = [
  {uri: images.terms1, width: 960, height: 1491},
  {uri: images.terms2, width: 960, height: 1383},
  {uri: images.terms3, width: 960, height: 1365},
  {uri: images.terms4, width: 960, height: 1593},
  {uri: images.terms5, width: 960, height: 1161},
  {uri: images.terms6, width: 960, height: 1521},
  {uri: images.terms7, width: 960, height: 1710},
  {uri: images.terms8, width: 960, height: 921},
];

const TermsScreen = () => {
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
    </ScreenContainer>
  );
};

export default TermsScreen;
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
