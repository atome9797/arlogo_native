import {Background} from '@react-navigation/elements';
import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import Toast from 'react-native-root-toast';
import StepIndicator from '../../component/customLogo/StepIndicator';
import ScreenContainer from '../../component/ScreenContainer';
import {deviceSize, toast} from '../../utils/libs';
import styles, {imgW3} from '../../utils/styles';

const step3List = [
  {no: 1, text: '강렬한'},
  {no: 2, text: '감성적인'},
  {no: 3, text: '귀여운'},
  {no: 4, text: '신뢰감있는'},
  {no: 5, text: '신선한'},
  {no: 6, text: '자연적인'},
  {no: 7, text: '친환경의'},
  {no: 8, text: '편안한'},
  {no: 9, text: '트렌디한'},
  {no: 10, text: '기술적인'},
  {no: 11, text: '권위적인'},
  {no: 12, text: '우아한'},
  {no: 13, text: '심플한'},
  {no: 14, text: '전통적인'},
  {no: 15, text: '레트로한'},
  {no: 16, text: '견고한'},
  {no: 17, text: '안전한'},
  {no: 18, text: '재미있는'},
];

const Step3 = ({navigation, route}: any) => {
  const {params} = route;
  // console.log(params);
  const [isDisable, isDisableSet] = useState(true);
  const [adjective, adjectiveSet] = useState([] as any);

  const checkStep = () => {
    if (adjective.length === 0) {
      // Toast.show('분위기를 선택해 주세요.');
      toast('분위기를 선택해 주세요.', 80);
      return;
    }
    navigation.navigate('RecommendList', {
      ...params,
      adjective,
    });
  };
  const selectadjective = useCallback(
    (selectedItem: any) => {
      let temp = adjective;
      // console.log(temp, temp.length);
      // if (selectedItem === step3List.length) {
      if (temp.length === 0) {
        isDisableSet(false);
        adjectiveSet([selectedItem]);
      } else {
        // temp = temp.filter((d: any) => d !== step3List.length - 1);
        if (!temp.includes(selectedItem)) {
          if (temp.length < 3) {
            temp.push(selectedItem);
          } else {
            // Toast.show(`최대 3개까지 선택할 수 있습니다.`);
            toast('최대 3개까지 선택할 수 있습니다.', 80);
            return;
          }
        } else {
          temp.splice(temp.indexOf(selectedItem), 1);
        }
        const set = new Set(temp);
        let uniqueArr = [...set];
        isDisableSet(uniqueArr.length > 0 ? false : true);
        adjectiveSet(uniqueArr);
      }
    },
    [adjective],
  );
  return (
    <ScreenContainer>
      <View style={[styles.flex1, styles.p20]}>
        <View style={{marginTop: 30}}>
          <StepIndicator totalPage={3} currentPage={2} />
        </View>
        <ScrollView style={styles.flex1}>
          <View>
            <Text
              style={[styles.textHeader, {marginBottom: 12, color: '#fff'}]}>
              원하는 로고 분위기를 선택해주세요.
            </Text>
            <Text style={styles.textDescription}>
              선택한 분위기에 맞춰 텍스트, 심볼 등이 디자인됩니다.
            </Text>
            <View style={[styles.imageListWrap, style.container]}>
              {step3List.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => selectadjective(item.no)}
                  style={[
                    style.itemWrap,
                    adjective.includes(item.no) && style.activeBorder,
                    (index + 1) % 3 !== 0 && style.mr10,
                  ]}>
                  <Text
                    style={[
                      style.itemText,
                      adjective.includes(item.no) && style.activeColor,
                    ]}>
                    {item.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <Button
        mode="contained"
        style={{
          backgroundColor: isDisable ? '#888' : '#5794ff',
          borderRadius: 0,
        }}
        contentStyle={{height: 62}}
        textColor={'#fff'}
        disabled={isDisable}
        onPress={checkStep}>
        완료
      </Button>
    </ScreenContainer>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // paddingHorizontal: 20,
    // width: deviceSize.width - 0,
    // backgroundColor: 'yellow',
  },
  itemWrap: {
    marginBottom: 12,
    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: imgW3,
    paddingVertical: 10,
    marginRight: 0,
  },
  mr10: {marginRight: 10},
  itemText: {
    textAlign: 'center',
    fontFamily: 'NanumBarunGothic',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c4c4c4',
  },
  activeBorder: {borderColor: '#5794ff'},
  activeColor: {color: '#5794ff'},
});

export default Step3;
