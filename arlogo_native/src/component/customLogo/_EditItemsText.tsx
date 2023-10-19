import React, {useState} from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import images from '../../utils/images';
import {deviceSize, isIos} from '../../utils/libs';
import {DragTextEditor, DragTextRef} from 'react-native-drag-text-editor';
import {IconButton} from './textEditor';
import {ICONS} from '../../screens/customLogo/constants';
import styles from '../../utils/styles';

const EditItemsText = ({
  item,
  DragTextEditorRef,
  onChangeText,
  activeStyleHandler,
  setActiveIndex,
  removeText,
}: any) => {
  const [currentDeg, setCurrentDeg] = useState(0);

  const _cornerComponents = [
    {
      side: 'TR',
      customCornerComponent: () => (
        <Pressable onPress={() => removeText(item.key)}>
          <Image source={images.icon_delete} style={styles.image24} />
        </Pressable>
      ),
    },
  ];

  const _rotateComponent = {
    side: 'bottom',
    customRotationComponent: () => <IconButton iconName={ICONS.ROTATE_ICON} />,
  };
  const _resizerComponents = () => (
    <Image source={images.icon_scale} style={styles.image24} />
  );

  const _resizerSnapPoints = ['corner'];
  return (
    <DragTextEditor
      key={item.key}
      onChangeText={onChangeText}
      // value={activeIndex === item.key ? textValue : item.text}
      value={item.text || ''}
      visible={item.visible}
      ref={ref => (DragTextEditorRef.current[item.key] = ref)}
      onItemActive={() => {
        // manageActiveStatus(index);
        // console.log('asdf', item.key);
        setActiveIndex(item.key);
      }}
      placeholder={item.text ? '' : item.placeholder}
      cornerComponents={_cornerComponents}
      resizerSnapPoints={_resizerSnapPoints}
      resizerComponents={_resizerComponents}
      rotationComponent={_rotateComponent}
      externalTextStyles={[
        {
          color: item.color,
          fontFamily: item.fontFamily,
          // fontSize: item.fontSize,
          // lineHeight: item.fontSize,
          letterSpacing: 0,
          margin: 0,
          padding: 0,
        },
        activeStyleHandler(item.key),
      ]}
      externalBorderStyles={{flex: 1}}
      initValue={item}
    />
  );
};
const style = StyleSheet.create({});
export default EditItemsText;
