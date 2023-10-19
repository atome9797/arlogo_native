import {StyleSheet} from 'react-native';
import {deviceSize} from './libs';

export const imgW4 = parseInt((deviceSize.width - 40) / 4);
export const imgW3 = parseInt((deviceSize.width - 40 - 20) / 3);
export const imgW2 = parseInt((deviceSize.width - 40 - 20) / 2);
const styles = StyleSheet.create({
  flex1: {flex: 1},
  rowsc: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rowcc: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowbc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexcc: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexWrap: {flexWrap: 'wrap'},
  h100: {height: 100},
  h200: {height: 200},
  p20: {padding: 20},
  pt10: {paddingTop: 10},
  pt20: {paddingTop: 20},
  pb10: {paddingBottom: 10},
  pb20: {paddingBottom: 20},
  ml10: {marginLeft: 10},
  ml20: {marginLeft: 20},
  mr0: {marginRight: 0},
  mr10: {marginRight: 10},
  mr20: {marginRight: 20},
  mb4: {marginBottom: 4},
  mb12: {marginBottom: 12},
  mb20: {marginBottom: 20},
  mb30: {marginBottom: 30},
  mb40: {marginBottom: 40},
  wh100: {width: '100%', height: '100%'},
  hidden: {overflow: 'hidden'},
  bgWhite: {backgroundColor: '#fff'},
  abs00: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 10,
    borderRadius: 100,
    backgroundColor: '#5794ff',
  },
  icon12: {
    width: 12,
    height: 12,
  },
  icon18: {
    width: 18,
    height: 18,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  icon36: {
    width: 36,
    height: 36,
  },
  icon40: {
    width: 40,
    height: 40,
  },
  icon44: {
    width: 44,
    height: 44,
  },
  icon64: {
    width: 64,
    height: 64,
  },
  image24: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  imageWrap: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  //main
  imageListWrap: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageListItem: {
    width: imgW3,
    height: imgW3,
    marginBottom: 10,
  },
  imageListItem2: {
    width: imgW2,
    height: imgW2,
    marginBottom: 20,
  },
  // Generator
  textHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 28,
    marginBottom: 40,
  },
  textDescription: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 36,
    color: '#888',
  },
  textInput: {
    backgroundColor: '#1f2024',
    borderColor: '#31333c',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    color: '#fff',
    paddingLeft: 16,
  },
  modalStyle: {
    flex: 1,
    width: deviceSize.width,
    height: deviceSize.height,
    padding: 0,
    margin: 0,
  },
  modalViewWrap: {
    backgroundColor: '#25262b',
    borderRadius: 12,
    marginHorizontal: 20,
  },
  modalHeaderText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 14 * 1.57,
    marginVertical: 32,
  },
  modalButtonWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#31333c',
    borderTopWidth: 1,
  },
  modalButtonLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#31333c',
    borderRightWidth: 1,
    paddingVertical: 16,
  },
  modalButtonRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonLeftText: {
    color: '#fff',
  },
  modalButtonRightText: {
    color: '#5794ff',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  subtitleText: {
    fontWeight: 'normal',
    fontSize: 14,
    color: '#fff',
  },
});
export default styles;
