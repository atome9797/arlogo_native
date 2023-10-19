import React, {useState} from 'react';
import {View, ScrollView, StatusBar} from 'react-native';
import {FAB, withTheme} from 'react-native-paper';
import styles from '../../utils/styles';
import ScreenContainer from '../../component/ScreenContainer';
import CurrentLogoItem from '../../component/home/CurrentLogoItem';
import RecommandLogoItem from '../../component/home/RecommandLogoItem';
import ARContentsItem from '../../component/home/ARContentsItem';

import {isIos} from '../../utils/libs';
import PermissionModal from '../../component/home/PermissionModal';
import TopVisual from '../../component/home/TopVisual';

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

const HomeScreen = ({navigation}: any) => {
  const [hasPermission, hasPermissionSet] = useState(true);
  return (
    <Container>
      {!hasPermission ? (
        <PermissionModal hasPermissionSet={hasPermissionSet} />
      ) : (
        <View style={styles.flex1}>
          {/* <LoadingScreen /> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[styles.flex1]}>
            <TopVisual navigation={navigation} />
            <View style={[styles.flex1, styles.p20]}>
              <CurrentLogoItem />
              <RecommandLogoItem />
              <ARContentsItem />
            </View>
          </ScrollView>
          <FAB
            icon="plus"
            style={styles.fab}
            color={'#fff'}
            onPress={() => navigation.navigate('Step1')}
          />
        </View>
      )}
    </Container>
  );
};

export default withTheme(HomeScreen);
