import React, {useCallback, useMemo, useState} from 'react';
import {View, Image, Pressable, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {captureRef} from 'react-native-view-shot';
import images from '../../utils/images';
import {
  calcExportSize,
  deviceSize,
  isEmptyObject,
  myAsyncPDFFunction,
  shareSingleImage,
} from '../../utils/libs';
import styles from '../../utils/styles';
import FImage from '../common/fimage';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
const exportFormat = [
  {
    type: 'jpg',
    source: images.icon_jpg,
    sourceS: images.icon_jpg_s,
    isOpen: true,
  },
  {
    type: 'png',
    source: images.icon_png,
    sourceS: images.icon_png_s,
    isOpen: false,
  },
  {
    type: 'pdf',
    source: images.icon_pdf,
    sourceS: images.icon_pdf_s,
    isOpen: false,
  },
];
const exportSize = ['낮은', '기본', '높은'];

const ExportModal = ({
  exportModalRef,
  isModalExport2d,
  isModalExport2dSet,
  betaModalSet,
  selectedData,
  snapRefs,
}) => {
  const insets = useSafeAreaInsets();
  const [exportData, exportDataSet] = useState({});

  const manualCapture = idx => {
    const target = snapRefs?.current[idx];
    // console.log(target);
    if (isEmptyObject(selectedData)) return;
    if (!target) return;

    const _format = exportData?.format === 'jpg' ? exportData?.format : 'png';
    const _size = exportData?.calcSize;
    const _options = {
      format: _format,
      quality: 1,
      width: _size[0] / 3,
      height: _size[1] / 3,
    };
    // console.log(_options);
    // return;
    captureRef(target, _options).then(
      async uri => {
        console.log("uri : " + uri);
        if (exportData?.format === 'pdf') {
          const pdfFile = await myAsyncPDFFunction(uri, {
            width: _options.width,
            height: _options.height,
          });
          shareSingleImage(pdfFile);
        } else {
          shareSingleImage(uri);
        }
      },
      error => console.error('Oops, snapshot failed', error),
    );
  };
  const snapPoints = useMemo(() => [deviceSize.height / 2], []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        enableTouchThrough={true}
        onPress={() => {
          exportModalRef.current?.dismiss();
          exportDataSet({});
        }}
      />
    ),
    [],
  );
  // console.log('insets.bottom:', insets.bottom);
  return (
    <>
      <BottomSheetModal
        ref={exportModalRef}
        index={0}
        enablePanDownToClose
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        // onChange={handleSheetChanges}
        backgroundStyle={style.bg}
        handleStyle={style.handle}
        enableHandlePanningGesture={false}>
        <View
          style={[
            // styles.flex1,
            {
              paddingBottom: insets.bottom === 0 ? 28 : insets.bottom,
              // paddingBottom: 0,
              paddingHorizontal: 18,
              paddingVertical: 16,
              flex: 1,
            },
          ]}>
          <View style={style.exportHeaderWrap}>
            <Pressable
              onPress={() => {
                exportModalRef.current?.dismiss();
                exportDataSet({});
              }}
              style={{position: 'absolute', left: 0, top: 0}}>
              <FImage source={images.icon_back_arrow} style={styles.icon24} />
            </Pressable>
            <Text style={{fontSize: 17, color: '#f8f8f8', marginTop: 3}}>
              설정
            </Text>
          </View>
          <View style={style.exportContentWrap}>
            <Text style={[styles.subtitleText, styles.mb12]}>포맷</Text>
            <View style={[styles.rowcc, styles.mb30]}>
              {exportFormat.map((item, index) => {
                // console.log('exportData?.format:', exportData?.format);
                const isSelected = exportData?.format === item.type;
                const imgSource = isSelected ? item.sourceS : item.source;
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      exportDataSet(prev => {
                        return {...prev, format: item.type};
                      });
                      // if (item.isOpen) {
                      // } else {
                      //   betaModalSet(true);
                      // }
                    }}
                    style={[
                      style.exportFormatItem,
                      styles.mr10,
                      isSelected && style.activeBorder,
                    ]}>
                    <FImage
                      source={imgSource}
                      style={[styles.icon24, styles.mb4]}
                    />
                    <Text
                      style={[
                        style.exportFormatItemText,
                        isSelected && style.activeColor,
                      ]}>
                      {item.type.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={[styles.subtitleText, styles.mb12]}>품질</Text>
            <View style={[styles.rowcc]}>
              {exportSize.map((item, index) => {
                const isSelected = exportData?.size === item;
                const _getSize = calcExportSize(
                  item,
                  selectedData?.data[0]?.ratio,
                );
                const sizeWH = `${_getSize[0]} x ${_getSize[1]} px`;
                // console.log(sizeWH);
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      exportDataSet(prev => {
                        return {...prev, size: item, calcSize: _getSize};
                      });
                      // if (index === 0) {
                      // } else {
                      //   betaModalSet(true);
                      // }
                    }}
                    style={[
                      style.exportFormatItem,
                      styles.mr10,
                      isSelected && style.activeBorder,
                    ]}>
                    <Text
                      style={[
                        style.exportFormatItemText,
                        isSelected && style.activeColor,
                      ]}>
                      {item}
                    </Text>
                    <Text
                      style={[
                        style.exportFormatItemTextSub,
                        isSelected && style.activeColor,
                      ]}>
                      {sizeWH}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <Pressable
            style={[
              style.btnExport,
              exportData?.format && exportData?.size && style.activeBg,
              {
                // marginBottom: insets.bottom,
              },
            ]}
            disabled={!exportData?.format || !exportData?.size}
            onPress={() => {
              manualCapture(selectedData?.index);
            }}>
            <Text style={styles.titleText}>내보내기</Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    </>
  );
};
export default ExportModal;
const style = StyleSheet.create({
  bg: {backgroundColor: '#0c0c10'},
  handle: {display: 'none'},
  exportHeaderWrap: {
    padding: 0,
    // paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'yellow',
    // height: 50,
  },
  exportContentWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  exportFormatItem: {
    width: (deviceSize.width - 60) / 3,
    borderColor: '#707070', // #5794ff
    borderWidth: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  exportFormatItemTextSub: {
    fontSize: 10,
  },
  activeBg: {backgroundColor: '#5794ff'},
  activeBorder: {borderColor: '#5794ff'},
  activeColor: {color: '#5794ff'},
  btnExport: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 8,
    backgroundColor: '#c4c4c4',
    // marginBottom: 28,
  },
  exportFormatItemText: {
    color: '#c4c4c4',
    textAlign: 'center',
    fontSize: 14,
  },
});
