import React from 'react';
import {View, Image, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-paper';
import styles from '../../utils/styles';
import FImage from '../common/fimage';
const ARContentsItem = () => {

  const navigation = useNavigation();

  return (
    <View>
      <View style={[styles.rowbc, styles.pb10]}>
        <Text variant="bodyLarge">AR 콘텐츠</Text>
      </View>

      <View style={styles.imageListWrap}>
        {[...Array(9).keys()].map((item, index) => {

          return (
            <Pressable
              onPress={() => {
                console.log('key:', index);
                navigation.navigate('ARScreen', {
                  target: 'edit',
                  key : index,
                });
              }}
              key={index}
              style={[
                styles.imageListItem,
                {
                  marginRight: (index + 1) % 3 == 0 ? 0 : 10,
                },
            ]}>
              <FImage
                style={styles.wh100}
                source={{uri: `https://picsum.photos/200/300?${index}`}}
              />
            </Pressable>
          )
        })}
      </View>
    </View>
  );
};
export default ARContentsItem;
