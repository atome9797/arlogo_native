import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Slider from '../Slider/Slider';
import {EditorTypes} from './types';
import {useLogoContext} from '../../../../screens/customLogo/hooks/useLogoContext';

const Editor = ({editTextsArray, editFontSize, addNewText}: EditorTypes) => {
  const {sharedSliderValue} = useLogoContext();
  return (
    <View style={_exampleStyles.editorContainer}>
      <Slider onEnded={() => editFontSize(sharedSliderValue.value)} />
    </View>
  );
};

const _exampleStyles = StyleSheet.create({
  gestureRootStyles: {
    ...StyleSheet.absoluteFillObject,
  },
  editorContainer: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 20,
    paddingVertical: 40,
  },
  addTextButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontOptions: {
    margin: 2,
    // flex: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  colorOptions: {
    margin: 4,
    flex: 1,
    padding: 20,
    borderRadius: 10,
  },
});

export default Editor;
