import React from 'react';

import {
  Svg,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import {
  bgRatio,
  deviceSize,
  getAnglePercentageObject,
  radianlXY,
} from '../../utils/libs';
const _w = Math.ceil(deviceSize.width);
const SvgBg = ({data}: any) => {
  const gradientType = data.gradientType || 0;
  // console.log('gradientType:', gradientType);
  const hasColors = data.color?.replace(/\s/g, '').split(',');
  const selectedColor1 = hasColors[0];
  const selectedColor2 =
    hasColors.length > 1 ? hasColors[1].trim() : selectedColor1;
  const ratio = data.ratio ? bgRatio(data.ratio) : {width: _w, height: _w};
  const x = data.x || 0;
  const y = data.y || 0;
  const w = Math.ceil(data.w) || _w;
  const h = Math.ceil(data.h) || _w;
  const {x1, x2, y1, y2} = getAnglePercentageObject((gradientType - 5) * 90);
  return (
    <Svg x={x} y={y} width={w} height={h}>
      <Defs>
        {hasColors.length === 1 && (
          <LinearGradient id="grad" x1={0} y1={0} x2="100%" y2="100%">
            <Stop
              offset="0%"
              stopColor={selectedColor1 || 'transparent'}
              stopOpacity={1}
            />
            <Stop
              offset="100%"
              stopColor={selectedColor2 || 'transparent'}
              stopOpacity={1}
            />
          </LinearGradient>
        )}
        {hasColors.length > 1 && gradientType >= 0 && gradientType < 5 && (
          <RadialGradient
            id="grad"
            cx={radianlXY(gradientType).x}
            cy={radianlXY(gradientType).y}
            rx={'100%'}
            ry={'100%'}
            gradientUnits="userSpaceOnUse">
            {hasColors.map((value, index) => (
              <Stop
                key={`RadialGradientItem_${index}`}
                offset={index === 0 ? '0%' : '100%'}
                stopColor={value}
                stopOpacity={1}
              />
            ))}
          </RadialGradient>
        )}
        {hasColors.length > 1 && gradientType >= 5 && gradientType < 9 && (
          <LinearGradient
            id="grad"
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}>
            {hasColors.map((value, index) => (
              <Stop
                key={`LinerGradientItem_${index}`}
                offset={index === 0 ? '0%' : '100%'}
                stopColor={value}
                stopOpacity={1}
              />
            ))}
          </LinearGradient>
        )}
      </Defs>
      {/* <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad-2)" /> */}
      <Rect
        fill={data.color === '' ? 'transparent' : 'url(#grad)'}
        x={x}
        y={y}
        width={w}
        height={h}
        rx="0"
        ry="0"
      />
    </Svg>
  );
};

export default SvgBg;
