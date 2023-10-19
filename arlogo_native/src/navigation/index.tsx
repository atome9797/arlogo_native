import * as React from 'react';
import {Image, Platform} from 'react-native';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  configureFonts,
} from 'react-native-paper';
import {ModalPortal} from 'react-native-modals';
import {RootSiblingParent} from 'react-native-root-siblings';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import images from '../utils/images';
import styles from '../utils/styles';
import {navigationRef} from './RootNavigation';
import {
  HomeScreen,
  Network,
  MyStorageApp,
  DrawerScreen,
  QNAScreen,
  TermsScreen,
  PrivacyScreen,
  Step1,
  Step2,
  Step3,
  RecommendList,
  EditMode,
  ARScreen,
} from '../screens/index';
import useStores from '../store/useStores';
import {observer} from 'mobx-react-lite';
import {deviceSize} from '../utils/libs';

const DrawerStack = createDrawerNavigator();
const DrawerkNavigator = ({navigation}: any) => {
  return (
    <DrawerStack.Navigator
      screenOptions={{
        drawerStyle: {
          // backgroundColor: '#c6cbef',
          // width: '90%',
        },
        headerStyle: {
          backgroundColor: navTheme.colors.background,
        },
        swipeEnabled: false,
      }}
      drawerContent={props => <DrawerScreen {...props} />}>
      <DrawerStack.Screen
        name="UXstory"
        component={HomeScreen}
        options={{
          swipeMinDistance: deviceSize.width * 0.2,
          headerShown: false,
        }}
      />
    </DrawerStack.Navigator>
  );
};
const iconSize = {w: 20, h: 20};
const iconMarginH = 15;
export const BackButton = () => {
  return (
    <Image
      style={{
        width: iconSize.w,
        height: iconSize.h,
        marginLeft: iconMarginH,
      }}
      source={images.icon_w_back}
      resizeMode={'contain'}
    />
  );
};
const MainStack = createNativeStackNavigator();
const MainStackScreen = () => {
  return (
    <MainStack.Navigator
      // screenOptions={({route, navigation}) => ({
      screenOptions={() => ({
        headerTitleAlign: 'center',
        // headerBackTitle: () => null,

        gestureEnabled: true,
        animation: 'slide_from_right',
        // animationDuration: 600,
        headerStyle: {
          backgroundColor: navTheme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: navTheme.colors.border,
          elevation: 1,
        },
        headerBackTitle: '',
        headerBackTitleVisible: false,
      })}>
      <MainStack.Screen
        name="Root"
        component={DrawerkNavigator}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="MyStorageApp"
        component={MyStorageApp}
        options={{
          title: '내 보관함',
          headerBackTitleVisible: false,
        }}
      />
      <MainStack.Screen
        name="QNAScreen"
        component={QNAScreen}
        options={{
          title: '문의하기',
        }}
      />
      <MainStack.Screen
        name="TermsScreen"
        component={TermsScreen}
        options={{
          title: '이용약관',
        }}
      />
      <MainStack.Screen
        name="PrivacyScreen"
        component={PrivacyScreen}
        options={{
          title: '개인정보처리방침',
        }}
      />
      <MainStack.Screen
        name="Step1"
        component={Step1}
        options={{
          title: '로고 제작',
        }}
      />
      <MainStack.Screen
        name="Step2"
        component={Step2}
        options={{
          title: '로고 제작',
        }}
      />
      <MainStack.Screen
        name="Step3"
        component={Step3}
        options={{
          title: '로고 제작',
        }}
      />
      <MainStack.Screen
        name="RecommendList"
        component={RecommendList}
        options={{
          title: '맞춤 로고',
        }}
      />
      <MainStack.Screen
        name="EditMode"
        component={EditMode}
        options={{
          title: '',
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen
        name="ARScreen"
        component={ARScreen}
        options={{
          title: '',
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </MainStack.Navigator>
  );
};
const NetworkStack = createNativeStackNavigator();
const NetworkScreen = () => {
  return (
    <NetworkStack.Navigator>
      <NetworkStack.Screen
        name="Network"
        component={Network}
        options={{
          headerShown: false,
          title: '네트워크연결 오류',
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
    </NetworkStack.Navigator>
  );
};
const fontConfig = {
  fontFamily: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'NanumBarunGothic',
    default: 'NanumBarunGothic, sans-serif',
  }),
  fontWeight: '400',
  letterSpacing: 0,
  lineHeight: 16 * 1.2,
  fontSize: 16,
};
export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: 'rgb(1, 1, 1)',
    border: 'rgb(39, 39, 41)',
    card: 'rgb(18, 18, 18)',
    notification: 'rgb(255, 69, 58)',
    primary: 'rgb(229, 229, 231)',
    text: 'rgb(255,255,255)',
  },
  dark: true,
  fonts: configureFonts({config: fontConfig}),
};
export const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0c0c10',
    border: 'rgb(39, 39, 41)',
    card: 'rgb(18, 18, 18)',
    notification: 'rgb(255, 69, 58)',
    primary: 'rgb(229, 229, 231)',
    text: '#fafafa',
  },
  dark: true,
};
const RootNavigator = observer(() => {
  const {store} = useStores();
  return (
    <PaperProvider theme={paperTheme}>
      <RootSiblingParent>
        <NavigationContainer theme={navTheme} ref={navigationRef}>
          {store.networkStatus ? (
            <>
              <MainStackScreen />
              <ModalPortal />
            </>
          ) : (
            <NetworkScreen />
          )}
        </NavigationContainer>
      </RootSiblingParent>
    </PaperProvider>
  );
});
export default RootNavigator;
