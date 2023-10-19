import React, {useState} from 'react';
import {ScrollView, TextInput, View, Text} from 'react-native';
import {Button, Checkbox} from 'react-native-paper';
import Toast from 'react-native-root-toast';
import StepIndicator from '../../component/customLogo/StepIndicator';
import ScreenContainer from '../../component/ScreenContainer';
import {toast} from '../../utils/libs';
import styles from '../../utils/styles';

const Step1 = ({navigation}: any) => {
  const [isDisable, isDisableSet] = useState(true);
  const [logoName, logoNameSet] = useState('');
  const [isSlogan, isSloganSet] = useState(false);
  const [slogan, sloganSet] = useState('');
  const checkStep = () => {
    if (logoName === '') {
      // Toast.show('로고를 입력해 주세요.');
      toast('로고를 입력해 주세요.', 80);
      return;
    }
    if (isSlogan && slogan === '') {
      // Toast.show('슬로건을 입력해 주세요.');
      toast('슬로건을 입력해 주세요.', 80);
      return;
    }
    navigation.navigate('Step2', {
      logoName: logoName.replace(/(^\s*)|(\s*$)/gi, ''),
      slogan: slogan.replace(/(^\s*)|(\s*$)/gi, ''),
    });
  };
  return (
    <ScreenContainer>
      <View style={[styles.flex1, styles.p20]}>
        <View style={{marginTop: 30}}>
          <StepIndicator totalPage={3} currentPage={0} />
        </View>
        <ScrollView style={styles.flex1}>
          <View>
            <Text style={[styles.textHeader, {color: '#fff'}]}>
              로고에 들어갈 텍스트를 입력해 주세요.
            </Text>
            <Text style={[styles.mb12, {color: '#fff'}]}>로고명</Text>
            <TextInput
              placeholder="로고명을 입력해 주세요."
              placeholderTextColor={'#54565c'}
              value={logoName}
              onChangeText={val => {
                let _val = val.replace(/^\s+/, '');
                // _val = _val.replace(/\s+$/, '');
                logoNameSet(_val);
                isDisableSet(!_val);
              }}
              style={styles.textInput}
            />
            <Checkbox.Item
              label="슬로건"
              status={isSlogan ? 'checked' : 'unchecked'}
              mode="android"
              position="leading"
              style={{
                width: 100,
                paddingLeft: 0,
              }}
              onPress={() => isSloganSet(!isSlogan)}
            />
            {isSlogan && (
              <TextInput
                placeholder="슬로건을 입력해 주세요."
                placeholderTextColor={'#54565c'}
                value={slogan}
                onChangeText={val => {
                  sloganSet(val);
                }}
                style={styles.textInput}
              />
            )}
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

export default Step1;
