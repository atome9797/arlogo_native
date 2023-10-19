import React from 'react';
import {TouchableWithoutFeedback, Keyboard, View} from 'react-native';

const DismissKeyboardHOC = Comp => {
  return ({children, ...props}) => (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={{flex: 1}}>
      <Comp {...props}>{children}</Comp>
    </TouchableWithoutFeedback>
  );
};

export const DismissKeyboardView = DismissKeyboardHOC(View);
