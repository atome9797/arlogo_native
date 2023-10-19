import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {SvgProps, SvgCss} from 'react-native-svg';
import * as Icons from '../../utils/logos';
import Icons2 from '../../utils/addSymbolList';
import useStores from '../../store/useStores';
import {observer} from 'mobx-react-lite';

type IconProps = SvgProps & {
  item?: any;
  name?: keyof typeof Icons;
  size?: number;
  gradient?: any;
  animatedPOositionStyles?: any;
  setActiveIndex?: any;
  activeIndex?: number;
};

const SvgIcon = observer(
  ({item, setActiveIndex, activeIndex, ...props}: IconProps) => {
    const {store} = useStores();
    const [svgXml, svgXmlSet] = useState('');

    const Comp = Icons[item.name] || Icons2[item.name];

    const width = item.w;
    const height = item.h;

    // const scale = item.scale || 1;
    const flipX = item.flip?.length > 0 ? item?.flip[0] || 1 : 1;
    const flipY = item.flip?.length > 0 ? item?.flip[1] || 1 : 1;
    const angle = item.angle || 0;
    let opacity = item.opacity || 1;
    if (
      store.sliderValues?.key === activeIndex &&
      item.key === store.sliderValues?.key
    ) {
      opacity = store.sliderValues?.opacityValue;
    }
    const sizeProps = {
      ...(width !== undefined ? {width} : {}),
      ...(height !== undefined ? {height} : {}),
    };
    const hasColors = item.color ? item.color?.split(',') : '#fff';
    const selectedColor1 = hasColors[0];
    if (!Comp) return null;
    const _Render = () => {
      return (
        <View
          style={{
            transform: [{scaleX: flipX}, {scaleY: flipY}],
            opacity,
          }}>
          <Comp {...props} fill={selectedColor1} {...sizeProps} />
        </View>
      );
    };
    return _Render();
  },
);

export default SvgIcon;
