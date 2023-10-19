import {observer} from 'mobx-react-lite';
import React, {useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Svg,
  Text,
  TextPath,
  TSpan,
} from 'react-native-svg';
import useStores from '../../store/useStores';
import {
  getAnglePercentageObject,
  isIos,
  radianlXY,
  // _alignAnchor,
  // _alignX,
} from '../../utils/libs';

const SvgText = ({item, setActiveIndex, activeIndex, via = ''}: any) => {
  const svgRef = useRef(null);
  const {store} = useStores();
  const [textLayout, textLayoutSet] = useState(0);
  const index = item.key;
  const text = item.text;
  // const color = item.color || '#000';
  const gradientType = item.gradientType || 0;
  const hasColors = item.color?.split(',');
  const selectedColor1 = hasColors[0];
  // const selectedColor2 = hasColors.length > 1 ? hasColors[1] : selectedColor1;
  const {x1, x2, y1, y2} = getAnglePercentageObject((gradientType - 5) * 90);

  const fontFamily = item.fontFamily || 'NanumGothic';

  // const fontWeight = convertFontWeight(item.fontWeight);
  const fontWeight = item.fontWeight || 'normal';
  // console.log('fontWeight:', fontWeight);
  // const scale = item.scale;
  const w = item.w + 0 || 0;
  const h = item.h + 0 || 0;
  let opacity = item.opacity || 1;
  let letterSpacing = item.letterSpacing || 0;
  let lineHeight = item.lineHeight || 1;
  let radian = item.radian || 0;
  let _via = via === 'common' ? 0.9 : 1;
  let fontSize = item.fontSize * _via || 50;
  if (
    store.sliderValues?.key === activeIndex &&
    item.key === store.sliderValues?.key &&
    store.sliderValues?.opacityValue
  ) {
    // console.log('opacity:', store.sliderValues?.opacityValue);
    opacity = store.sliderValues?.opacityValue;
  }
  if (
    store.sliderValues?.key === activeIndex &&
    item.key === store.sliderValues?.key &&
    store.sliderValues?.letterSpacing
  ) {
    // console.log('letterSpacing:', store.sliderValues?.letterSpacing);
    letterSpacing = store.sliderValues?.letterSpacing;
  }
  if (
    store.sliderValues?.key === activeIndex &&
    item.key === store.sliderValues?.key &&
    store.sliderValues?.lineHeight
  ) {
    lineHeight = store.sliderValues?.lineHeight;
  }
  if (
    store.sliderValues?.key === activeIndex &&
    item.key === store.sliderValues?.key &&
    store.sliderValues?.radian
  ) {
    radian = store.sliderValues?.radian;
  }
  if (
    store.sliderValues?.key === activeIndex &&
    item.key === store.sliderValues?.key &&
    store.sliderValues?.fontSize
  ) {
    // console.log('fontSize:', fontSize);
    fontSize = store.sliderValues?.fontSize;
  }
  const align = item.align || 'left';
  // const curve = h / 2 - (h / 2) * radian;
  const line = text?.split('\n')?.length || 1;
  // const _fz = Math.min(w, h) / 2;
  const maxTextLength =
    text === undefined ? 0 : Math.max(...text?.split('\n').map(t => t.length));
  const extSpacing = fontSize * (letterSpacing / (isIos ? 100 : 100));
  const extLineHeight = fontSize + fontSize * (lineHeight / 100);
  // console.log('extLineHeight:', h, line, fontSize, lineHeight, extLineHeight);
  const _alignX = (w, align, extSpacing = 0) => {
    let _xPos = 0;
    switch (align) {
      case 'left':
        _xPos = 0;
        _xPos += isIos ? 0 : extSpacing / 2;
        break;
      case 'center':
        _xPos = w / 2;
        _xPos += isIos ? extSpacing / 2 : extSpacing;
        break;
      case 'right':
        _xPos = w;
        // _xPos += isIos ? extSpacing : extSpacing * 1.5;
        _xPos += isIos ? extSpacing : extSpacing * 1;
        break;
    }
    return _xPos;
  };
  const _alignAnchor = align => {
    switch (align) {
      case 'left':
        return 'start';
      case 'center':
        return 'middle';
      case 'right':
        return 'end';
    }
  };
  // if (item.type === 'slogan') {
  //   console.log(item.x);
  // }
  // console.log(textLayout);
  const _Render = () => {
    return (
      <View style={{marginTop: 0}}>
        <Svg
          // onLayout={e => {
          //   const {layout} = e.nativeEvent;
          //   console.log(layout);
          // }}
          width={w}
          height={h - 0}
          // width={'100%'}
          // height={'100%'}
          viewBox={`0 0 ${w} ${h - 0}`}
          opacity={opacity}
          x={0}
          // y={textLayout?.y * -1 || 0}
          y={0}
          preserveAspectRatio="none"
          // preserveAspectRatio="xMinYMin meet"
        >
          <Defs>
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

          {text !== '' &&
            text !== undefined &&
            text.split('\n').map((item, index) => {
              const hPerLine = h / line;
              // const hPerLine = fontSize;
              const _h = hPerLine / 2;
              // const _h = fontSize / 2;
              // const _y = _h + ((index * h) / line) * lineHeight;
              let _y = _h + index * extLineHeight;
              if (radian >= 0) {
                if (index === 0) {
                  _y += (_h * radian) / 100;
                } else {
                  _y += (hPerLine * radian) / 100;
                }
              } else if (radian < 0) {
                if (index === 0) {
                  _y += (_h * radian) / 100;
                } else {
                  // console.log(
                  //   _y,
                  //   hPerLine * (radian / 100),
                  //   _h * (radian / 100),
                  // );
                  // _y += _h * (radian / 100);
                }
              }

              const charWidth = w / maxTextLength / 1;
              const fullRadianW = (w * 2) / Math.PI;
              const rangeXbyRadius = w - fullRadianW - charWidth;
              const xPos = Math.abs(charWidth * (radian / 100));
              const _curve = _y - (w / 2) * (radian / 100);
              return (
                <Path
                  key={index + radian}
                  id={`MyPath${index}`}
                  fill="none"
                  stroke="none"
                  d={`M ${xPos} ${_y} C ${xPos} ${_curve} ${
                    w - xPos
                  } ${_curve} ${w - xPos} ${_y}`}
                />
              );
            })}
          {/* <G> </G> */}
          <G>
            <Text
              ref={svgRef}
              x={0}
              y={0}
              onLayout={e => {
                const {layout} = e.nativeEvent;
                // console.log(item.type, item.w, item.h, layout);
                if (textLayout === 0 && layout.y < 0) {
                  textLayoutSet(layout.y * -1);
                }
              }}
              fill={hasColors.length > 1 ? 'url(#grad)' : selectedColor1}
              fontFamily={fontFamily}
              fontWeight={fontWeight}
              alignmentBaseline="middle"
              // alignmentBaseline="center"
              textAnchor={_alignAnchor(align)}
              // fontSize={fontSize * 0.9}
              fontSize={fontSize}
              letterSpacing={extSpacing}
              // dy={textLayout}
              // dy={textLayout?.y < 0 ? textLayout?.y * -1 : 0}
            >
              {text !== '' &&
                text !== undefined &&
                text.split('\n').map((item, index) => {
                  // const _y = ((index * h) / line) * lineHeight;
                  const hPerLine = h / line;
                  const _h = hPerLine / 2;
                  let _y = index * extLineHeight;
                  // if (textLayout?.y < 0) {
                  //   console.log(textLayout.y, _y);
                  //   // _y -= textLayout.y;
                  // }
                  let _x = _alignX(w, align, extSpacing);
                  if (index > 0) {
                    if (radian > 0) {
                      _y += (_h * radian) / 100;
                    } else if (radian < 0) {
                      _y -= (_h * radian) / 100;
                    }
                  }
                  // const _anchor = _alignAnchor(align);
                  // console.log('descender:', descender, textLayout);
                  return (
                    <TextPath
                      href={`#MyPath${0}`}
                      // textLength={w}
                      // method="stretch"
                      // lengthAdjust="spacingAndGlyphs"
                      // textLength="100%"
                      // lengthAdjust="spacingAndGlyphs"
                      startOffset="0%"
                      key={index}>
                      <TSpan x={_x} y={_y} dx={0} dy={textLayout + '0.1em'}>
                        {item}
                      </TSpan>
                    </TextPath>
                  );
                })}
            </Text>
          </G>
        </Svg>
      </View>
    );
  };
  return _Render();
};

export default SvgText;
