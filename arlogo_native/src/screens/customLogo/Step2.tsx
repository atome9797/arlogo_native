import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {Button, List, RadioButton} from 'react-native-paper';
import Toast from 'react-native-root-toast';
import StepIndicator from '../../component/customLogo/StepIndicator';
import ScreenContainer from '../../component/ScreenContainer';
import {step2List, toast} from '../../utils/libs';
import styles from '../../utils/styles';

const Step2 = ({navigation, route}: any) => {
  const {params} = route;

  const [isDisable, isDisableSet] = useState(true);
  const [category, categorySet] = useState(0);

  const checkStep = () => {
    if (category === 0) {
      // Toast.show('산업업종을 선택해 주세요.');
      toast('산업업종을 선택해 주세요.', 80);
      return;
    }
    navigation.navigate('Step3', {
      ...params,
      category,
    });
  };
  return (
    <ScreenContainer>
      <View style={[styles.flex1, styles.p20]}>
        <View style={{marginTop: 30}}>
          <StepIndicator totalPage={3} currentPage={1} />
        </View>
        <ScrollView style={styles.flex1}>
          <View>
            <Text
              style={[styles.textHeader, {marginBottom: 12, color: '#fff'}]}>
              산업・업종을 선택해 주세요.
            </Text>
            <Text style={styles.textDescription}>
              업종에 따라 맞춤 심볼을 추천해드립니다.
            </Text>

            <List.Section>
              {step2List.map((item, index) => (
                <View key={index} style={style.listWrap}>
                  <List.Accordion
                    title={item.title}
                    left={() => (
                      <RadioButton.Item
                        label={''}
                        value={item.title}
                        position="leading"
                        mode="android"
                        status={category === item.no ? 'checked' : 'unchecked'}
                        style={style.radioButton}
                        uncheckedColor="#888"
                        color="#5794ff"
                      />
                    )}
                    onPress={() => {
                      categorySet(item.no);
                      isDisableSet(false);
                    }}
                    style={style.innerWrap}
                    titleNumberOfLines={2}
                    titleStyle={style.innerTitle}
                    // expanded={item.no === category} // 선택한것만 펼치기
                    id={index}>
                    <View style={style.innerDescriptionWrap}>
                      <List.Item
                        title={item.desctiption}
                        titleNumberOfLines={100}
                        style={style.innerDescription}
                        titleStyle={style.innerDescriptionText}
                      />
                    </View>
                  </List.Accordion>
                </View>
              ))}
            </List.Section>
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
        다음
      </Button>
      {/* </View> */}
    </ScreenContainer>
  );
};

export default Step2;
const style = StyleSheet.create({
  listWrap: {
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  radioButton: {
    paddingLeft: 5,
    width: 35,
  },
  innerWrap: {
    backgroundColor: '#1f2024',
    padding: 0,
    paddingVertical: 3,
    paddingLeft: 0,
  },
  innerTitle: {
    fontWeight: 'normal',
    fontFamily: 'NanumBarunGothic',
    fontSize: 16,
    lineHeight: 16 * 1.3,
  },
  innerDescriptionWrap: {
    backgroundColor: '#1f2024',
    paddingLeft: 0,
    paddingRight: 0,
  },
  innerDescription: {
    borderTopWidth: 1,
    borderTopColor: '#54565c',
  },
  innerDescriptionText: {
    fontSize: 14,
  },
});
