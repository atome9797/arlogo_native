import React from 'react';
import {
  StatusBar,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {navTheme} from '../navigation';
import {isIos} from '../utils/libs';
// import {useHeaderHeight} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useHeaderHeight} from '@react-navigation/elements';
import {useKeyboard} from '@react-native-community/hooks';
// import {DismissKeyboardView} from './DismissKeyboardView';

const ScreenContainer = ({containerStyle = {}, children}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboard();

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <StatusBar
        hidden={false}
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />
      <KeyboardAvoidingView
        behavior={isIos ? 'padding' : null}
        keyboardVerticalOffset={keyboard.keyboardShown ? headerHeight - 5 : 0}
        style={[styles.container]}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default ScreenContainer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: navTheme.colors.background,
    // backgroundColor: 'red',
  },
});
