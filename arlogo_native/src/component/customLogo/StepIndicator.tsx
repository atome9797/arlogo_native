import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
// import {Text} from 'react-native-paper';
import StepIndicators from 'react-native-step-indicator';
import images from '../../utils/images';
import {deviceSize} from '../../utils/libs';
import FImage from '../common/fimage';

const stepStyle = {
  stepIndicatorSize: 12,
  currentStepIndicatorSize: 12,
  separatorStrokeWidth: 0,
  currentStepStrokeWidth: 0,
  stepStrokeCurrentColor: '#000',
  stepStrokeWidth: 0,
  stepStrokeFinishedColor: '#000',
  stepStrokeUnFinishedColor: '#000',
  separatorFinishedColor: '#000',
  separatorUnFinishedColor: '#000',
  stepIndicatorFinishedColor: '#000',
  stepIndicatorUnFinishedColor: '#000',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#fff',
  labelSize: 10,
  currentStepLabelColor: '#000',
};
const renderLabel = ({
  position,
  label,
  currentPosition,
}: {
  position: number;
  stepStatus: string;
  label: string;
  currentPosition: number;
}) => {
  let imgUrl = images.stepMarker1;
  if (label === '2') {
    imgUrl = images.stepMarker2;
  }
  if (label === '3') {
    imgUrl = images.stepMarker3;
  }
  return (
    <View
      style={{
        position: 'absolute',
        top: -53,
        opacity: position === currentPosition ? 1 : 0,
      }}>
      <Image
        style={{
          width: 22,
          height: 26,
        }}
        source={imgUrl}
        resizeMode={'contain'}
      />
    </View>
  );
};

const StepIndicator = ({totalPage, currentPage}: any) => (
  <View style={styles.wrapper}>
    <View style={styles.inner}>
      <StepIndicators
        stepCount={totalPage}
        customStyles={stepStyle}
        currentPosition={currentPage}
        labels={['1', '2', '3']}
        renderLabel={renderLabel}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    // marginBottom: 12,
    marginVertical: 15,
    alignItems: 'center',
  },
  inner: {
    width: deviceSize.width * 0.3,
    backgroundColor: '#333',
    borderRadius: 30,
    paddingTop: 5,
    height: 22,
  },
  stepLabel: {
    opacity: 0,
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
});

export default StepIndicator;
