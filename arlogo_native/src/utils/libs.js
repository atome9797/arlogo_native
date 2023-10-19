import {Dimensions, Platform, StatusBar} from 'react-native';
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import Share from 'react-native-share';
import RNImageToPdf from 'react-native-image-to-pdf';
import {defTransOptions} from './symbolList';
import Store from '../../src/store';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import images from './images';
import RNFS from 'react-native-fs';
// import {Buffer} from 'buffer';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import uuid from 'react-native-uuid';

const {width, height} = Dimensions.get('window');
export const deviceSize = {width, height};
export const isIos = Platform.OS === 'ios';

export const StatusBarHeight = isIos
  ? getStatusBarHeight()
  : StatusBar.currentHeight;
export const currentVersion = VersionCheck.getCurrentVersion();
export const currentBuildNumber = VersionCheck.getCurrentBuildNumber();
export const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getYMD = () => {
  var date = new Date();
  var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '');
  return dateString;
};
export const getYMDHIS = () => {
  var date = new Date();
  var year = date.getFullYear().toString();
  var month = date.getMonth() + 1;
  month = month < 10 ? '0' + month.toString() : month.toString();
  var day = date.getDate();
  day = day < 10 ? '0' + day.toString() : day.toString();
  var hour = date.getHours();
  hour = hour < 10 ? '0' + hour.toString() : hour.toString();
  var minites = date.getMinutes();
  minites = minites < 10 ? '0' + minites.toString() : minites.toString();
  var seconds = date.getSeconds();
  seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
  return year + month + day + hour + minites + seconds;
};
export const getYMD2 = () => {
  var date = new Date();
  var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  return dateString;
};
export function removeDuplicate(arr, key) {
  if (typeof arr !== 'object') return;
  return arr.reduce((acc, current) => {
    const x = acc.find(item => item[key] === current[key]);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
}
export const radian = 'rad';
export const calcPosition = (x, fullWidth = deviceSize.width) => {
  return (fullWidth * x) / 600;
};
export const reCalcPosition = (
  x,
  fullWidth = deviceSize.width,
  target = 600,
) => {
  return (fullWidth * x) / target;
};
export const getCenters = (_width, _height, _x, _y) => {
  'worklet';
  // const calcX = Math.min
  const x = _x + _width / 2;
  const y = _y + _height / 2;
  // console.log('getCenters:', _width, _height, _x, _y, x, y);
  // const x = (_x + (_x + _width)) / 2;
  // const y = (_y + (_y + _height)) / 2;
  return {x, y};
};
export const rotation = (event, ctx, initAngle) => {
  'worklet';
  let _radian = Math.atan2(event.y - ctx.centers.y, event.x - ctx.centers.x);
  let degrees = (_radian * 180) / Math.PI - initAngle;
  // console.log('degrees:', degrees);
  if (degrees < 0) {
    degrees += 360;
  }
  if (degrees >= 360) {
    degrees -= 360;
  }
  // console.log('degrees:', degrees);
  // console.log(toRadian(degrees));
  // console.log(degrees);
  return degrees;
};
export const _rotation = (event, ctx) => {
  'worklet';
  var angleDeg =
    (Math.atan2(
      event.absoluteY - ctx.centers.y,
      event.absoluteX - ctx.centers.x,
    ) *
      180) /
    Math.PI;
  return angleDeg + 90;
};
export const toDeg = rad => (rad * 180) / Math.PI;
export const toRadian = degree => {
  'worklet';
  const _radian = degree * (Math.PI / 180);
  return _radian;
};
export const inRange = (number, start, end) => {
  'worklet';
  return number >= Math.min(start, end) && number < Math.max(start, end);
};
export const toDegree = _radian => {
  'worklet';
  const degree = _radian * (180 / Math.PI);
  return degree;
};
export const pow2abs = (a, b) => {
  'worklet';
  return Math.pow(Math.abs(a - b), 2);
};

export const distance = (a, b) => {
  'worklet';
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  // return Math.sqrt(pow2abs(a.x, b.x) + pow2abs(a.y, b.y), 2);
};
export const getEventAbsolute = (event, cornerH) => {
  'worklet';
  const x = event.absoluteX;
  // const y = event.absoluteY - (event.absoluteY - cornerH);
  const y = event.absoluteY - cornerH;
  // console.log(event);
  return {x, y};
};
export const setLocal = async (key, value) => {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // console.error('AsyncStorage#setItem error: ' + error.message);
  }
};
export const getLocal = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return isEmptyObject(JSON.parse(value)) ? null : JSON.parse(value);
  } catch (error) {
    // Error retrieving data
  }
};
export function isEmptyObject(param) {
  if (param === undefined) return true;
  return Object.keys(param).length === 0 && param.constructor === Object;
}
export const clearAllLocal = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing app data.');
  }
};
export const copyObj = obj => {
  const result = {};

  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = copyObj(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }

  return result;
};
export function nestedCopy(array) {
  return JSON.parse(JSON.stringify(array));
}
export const bringTo = (array, index1, index2) => {
  [array[index1], array[index2]] = [array[index2], array[index1]];
  return array;
};
export const radianlXY = idx => {
  let _x = '0%';
  let _y = '0%';
  switch (idx) {
    case 1:
      _x = '100%';
      break;
    case 2:
      _y = '100%';
      break;
    case 3:
      _x = '100%';
      _y = '100%';
      break;
    case 4:
      _x = '50%';
      _y = '50%';
      break;
  }
  return {x: _x, y: _y};
};

export const getPercentageFromAngle = (angle, minVal, isRev = false) => {
  const step = 100 / 90;
  const actualDeg = angle - minVal;
  const percentage = step * actualDeg;
  return isRev ? 100 - percentage : percentage;
};

export const getAnglePercentageObject = angle => {
  let realAngle = angle;
  let angleObj = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  };

  if (realAngle <= 45) {
    realAngle += 360;
  }

  if (realAngle > 45 && realAngle <= 135) {
    angleObj = {
      x1: getPercentageFromAngle(realAngle, 45),
      x2: getPercentageFromAngle(realAngle, 45, true),
      y1: 100,
      y2: 0,
    };
  } else if (realAngle > 135 && realAngle <= 225) {
    angleObj = {
      x1: 100,
      x2: 0,
      y1: getPercentageFromAngle(realAngle, 135, true),
      y2: getPercentageFromAngle(realAngle, 135),
    };
  } else if (realAngle > 225 && realAngle <= 315) {
    angleObj = {
      x1: getPercentageFromAngle(realAngle, 225, true),
      x2: getPercentageFromAngle(realAngle, 225),
      y1: 0,
      y2: 100,
    };
  } else if (realAngle > 315) {
    angleObj = {
      x1: 0,
      x2: 100,
      y1: getPercentageFromAngle(realAngle, 315),
      y2: getPercentageFromAngle(realAngle, 315, true),
    };
  }

  return angleObj;
};
export const convertRatioToViroImage = (ratio = '1:1') => {
  switch (ratio) {
    case '1:1':
      return [1, 1];
    case '2:3':
      return [1, 1.5];
    case '3:4':
      return [1, 1.3];
    case '9:16':
      return [1, 1.78];
    case '3:2':
      return [0.67, 1];
    case '4:3':
      return [0.75, 1];
    case '16:9':
      return [0.56, 1];
  }
};
export const bgRatio = (
  ratio = '1:1',
  _w = deviceSize.width,
  _h = deviceSize.height,
  extHeight = 232,
) => {
  // const extHeight = 56 + 56 + 80 + 40; // header + bottom + subMenu + 여분
  const screenW = _w;
  const screenH = _w;
  const maxAreaH = _h - extHeight;
  let wh = {width: screenW, height: screenH};
  const ratioArr = ratio?.split(':');
  if (ratioArr?.length > 1) {
    let _ratio = ratioArr[1] / ratioArr[0];
    let _width = screenW;
    let _height = screenW * _ratio;
    if (_height > maxAreaH) {
      _ratio = ratioArr[0] / ratioArr[1];
      _height = maxAreaH;
      _width = maxAreaH * _ratio;
    }
    wh = {width: _width, height: _height};
    return wh;
  } else {
    return wh;
  }
};
const myStorageMaxSave = 10;
export const saveToMyStorage = async (symbolKey, isNewKey, objList) => {
  const myStorage = (await getLocal('myStorage')) || [];
  const currentKey = isNewKey ? `${symbolKey}_${getYMDHIS()}` : symbolKey;
  const currentObj = {
    key: currentKey,
    value: objList,
  };
  let result = [];
  const hasLocal = myStorage.filter(item => item.key === currentKey);
  if (myStorage.length === 0 || hasLocal.length === 0) {
    // result = [currentObj, ...myStorage].slice(0, myStorageMaxSave);
    result = [currentObj, ...myStorage];
  } else {
    result = myStorage.map(item => {
      if (item.key === currentKey) {
        return currentObj;
      }
      return item;
    });
    const findIndex = result.findIndex(item => item.key === currentKey);
    const tempArr = result.splice(findIndex, 1);
    // result = [...tempArr, ...result].slice(0, myStorageMaxSave);
    result = [...tempArr, ...result];
  }
  result = removeDuplicate(result, 'key');
  console.log('resultTest::', result)
  console.log('result.length::', result.length);
  if (result.length <= 10) {
    Store.setMyStorage(result);
    // Toast.show('내 보관함에 저장되었습니다.', {
    //   position: Toast.positions.BOTTOM - 150,
    // });
    toast('내 보관함에 저장되었습니다.\n(최대 10개까지 저장)', 150);
    return true;
  } else {
    toast('로고는 최대 10개까지 저장 가능합니다.', 150);
    return false;
  }
};
export const toast = (text, bottom = 0) => {
  Toast.show(text, {
    position: Toast.positions.BOTTOM - bottom,
    backgroundColor: '#666971',
    textColor: '#fff',
    shadow: false,
    containerStyle: {
      width: deviceSize.width - 56,
      paddingVertical: 20,
      zIndex: 99999999,
      borderRadius: 12,
      opacity: 1,
    },
    opacity: 1,
    textStyle: {
      fontSize: 14,
      fontFamily: 'NanumBarunGothic',
    },
  });
};
export const shareSingleImage = async imgUrl => {
  const shareOptions = {
    title: 'Share file',
    url: imgUrl,
    failOnCancel: false,
    filename: 'ShareImage',
  };

  try {
    const ShareResponse = await Share.open(shareOptions);
    console.log('Result =>', ShareResponse);
    // setResult(JSON.stringify(ShareResponse, null, 2));
  } catch (error) {
    console.log('Error =>', error);
    // setResult('error: '.concat(getErrorString(error)));
  }
};

/**
 * This function shares PDF and PNG files to
 * the Files app that you send as the urls param
 */
export const shareToFiles = async fileUrl => {
  const shareOptions = {
    title: 'Share file',
    failOnCancel: false,
    saveToFiles: true,
    urls: [fileUrl], // base64 with mimeType or path to local file
  };

  // If you want, you can use a try catch, to parse
  // the share response. If the user cancels, etc.
  try {
    const ShareResponse = await Share.open(shareOptions);
    console.log('Result =>', ShareResponse);
    // setResult(JSON.stringify(ShareResponse, null, 2));
  } catch (error) {
    console.log('Error =>', error);
    // setResult('error: '.concat(getErrorString(error)));
  }
};
export const fastImageResize = resize => {
  let _resize = FastImage.resizeMode.cover;
  switch (resize) {
    case 'contain':
      _resize = FastImage.resizeMode.contain;
      break;
    case 'cover':
      _resize = FastImage.resizeMode.cover;
      break;
    case 'center':
      _resize = FastImage.resizeMode.center;
      break;
    case 'stretch':
      _resize = FastImage.resizeMode.stretch;
      break;
  }
};
export const myAsyncPDFFunction = async (imgUri, size) => {
  try {
    const options = {
      // imagePaths: ['/path/to/image1.png','/path/to/image2.png'],
      imagePaths: [imgUri],
      name: uuid.v4(),
      maxSize: {
        // optional maximum image dimension - larger images will be resized
        width: size.width,
        height: size.height,
      },
      quality: 1, // optional compression paramter
    };
    const pdf = await RNImageToPdf.createPDFbyImages(options);

    console.log('pdf.filePath:', pdf.filePath);
    return pdf.filePath;
  } catch (e) {
    console.log('myAsyncPDFFunction error:', e);
  }
};
export const _alignX = (w, align, extSpacing = 0) => {
  switch (align) {
    case 'left':
      return 0 + extSpacing;
    case 'center':
      return w / 2 + extSpacing;
    case 'right':
      return w + extSpacing;
  }
};
export const _alignAnchor = align => {
  switch (align) {
    case 'left':
      return 'start';
    case 'center':
      return 'middle';
    case 'right':
      return 'end';
  }
};
export const convertFontWeight = value => {
  if (!isNaN(parseFloat(value))) {
    return value;
  }
  switch (value) {
    case 'Bold':
      return '700';
    case 'Light':
      return '300';
    case 'Regular':
      return '400';
    case 'Medium':
      return '500';
    default:
      return '400';
  }
};
export const calcExportSize = (value, ratio = '1:1') => {
  const _ratio = convertRatioToViroImage(ratio);
  // console.log('_ratio?.length:', _ratio?.length, ratio);
  if (!_ratio?.length) {
    return [600, 600];
  }
  const _x = 600 * _ratio[0];
  const _y = 600 * _ratio[1];
  let type = 1;
  switch (value) {
    case '낮은':
      type = 1;
      break;
    case '기본':
      type = 2;
      break;
    case '높은':
      type = 3;
      break;
  }
  return [_x * type, _y * type];
  // return `${_x * type} x ${_y * type}`;
};
// <1:1>
// 낮은 : 600 x 600 px (x1)
// 기본 : 1200 x 1200 px (x2)
// 높은 : 1800 x 1800 px (x3)

// <2:3>
// 낮은 : 600 x 900 px (x1)
// 기본 : 1200 x 1800 px (x2)
// 높은 : 1800 x 2700 px (x3)

// <3:4>
// 낮은 : 600 x 800 px (x1)
// 기본 : 1200 x 1600 px (x2)
// 높은 : 1800 x 2400 px (x3)

// <9:16>
// 낮은 : 600 x 1067 px (x1)
// 기본 : 1200 x 2134 px (x2)
// 높은 : 1800 x 3201 px (x3)

// <3:2>
// 낮은 : 600 x 400 px (x1)
// 기본 : 1200 x 800 px (x2)
// 높은 : 1800 x 1200 px (x3)

// <4:3>
// 낮은 : 600 x 450 px (x1)
// 기본 : 1200 x 900 px (x2)
// 높은 : 1800 x 1350 px (x3)

// <16:9>
// 낮은 : 600 x 337.5 px (x1)
// 기본 : 1200 x 675 px (x2)
// 높은 : 1800 x 1012.5 px (x3)

// const cos = Math.cos;
// const sin = Math.sin;
// const π = Math.PI;

// const f_matrix_times = ([[a, b], [c, d]], [x, y]) => [
//   a * x + b * y,
//   c * x + d * y,
// ];
// const f_rotate_matrix = x => [
//   [cos(x), -sin(x)],
//   [sin(x), cos(x)],
// ];
// const f_vec_add = ([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2];

// export const f_svg_ellipse_arc = ([cx, cy], [rx, ry], [t1, Δ], φ) => {
//   Δ = Δ % (2 * π);
//   const rotMatrix = f_rotate_matrix(φ);
//   const [sX, sY] = f_vec_add(
//     f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]),
//     [cx, cy],
//   );
//   const [eX, eY] = f_vec_add(
//     f_matrix_times(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]),
//     [cx, cy],
//   );
//   const fA = Δ > π ? 1 : 0;
//   const fS = Δ > 0 ? 1 : 0;
//   const result = `M ${sX} ${sY} A ${[
//     rx,
//     ry,
//     (φ / (2 * π)) * 360,
//     fA,
//     fS,
//     eX,
//     eY,
//   ].join(' ')}`;

//   return result;
// };

String.prototype.Trim = function () {
  return this.replace(/(^\s*)|(\s*$)/gi, '');
};

String.prototype.Ltrim = function () {
  return this.replace(/^\s*/, '');
};

String.prototype.Rtrim = function () {
  return this.replace(/\s*$/, '');
};

export const step2List = [
  {no: 1, title: '농업, 임업 및 어업', desctiption: '농업, 임업, 어업'},
  {
    no: 2,
    title: '광업',
    desctiption:
      '석탄/원유 및 천연가스 광업, 금속 광업, 비금속광물 광업(연료용 제외), 광업 지원 서비스업',
  },
  {
    no: 3,
    title: '제조업',
    desctiption:
      '식료품, 음료, 담배, 섬유제품(의복 제외), 가죽/가방/신발, 목재/나무 (가구 제외), 펄프/종이/종이제품, 인쇄/기록매체 복제, 코크스/연탄/석유정제품, 화학 물질/화학제품 (의약품 제외), 의료용 물질/의약품, 고무/플라스틱 제품, 비금속 광물제품, 1차 금속, 금속 가공제품 (기계/가구 제외), 전자부품/컴퓨터/영상/은향/통신장비, 의료/정밀/광학 기기/시계, 전기장비, 기타 기계/장비, 자동차/트레일러, 기타 운송장비, 가구, 기타 제품, 산업용 기계/장비 수리업',
  },
  {
    no: 4,
    title: '전기, 가스, 증기 및 공기 조절 공급업',
    desctiption:
      '전기업, 연료용 가스 제조 및 배관공급업, 증기/냉〮온수 및 공기 조절 공급업',
  },
  {
    no: 5,
    title: '수도, 하수 및 폐기물 처리, 원료 재생업',
    desctiption:
      '수도업, 하수/폐수/분뇨 처리업, 폐기물 수집/운반/처리/원료 재생업, 환경 정화 및 복원업',
  },
  {no: 6, title: '건설업', desctiption: '종합 건설업, 전문직별 공사업'},
  {
    no: 7,
    title: '도매 및 소매업',
    desctiption:
      '자동차 및 부품 판매업, 도매 및 상품 중개업, 소매업 (자동차 제외)',
  },
  {
    no: 8,
    title: '운수 및 창고업',
    desctiption:
      '육상 운송 및 파이프라인 운송업, 수상 운송업, 항공 운송업, 창고 및 운송관련 서비스업',
  },
  {
    no: 9,
    title: '숙박 및 음식점업',
    desctiption:
      '일반 및 생활 숙박시설 운영업, 기타 숙박업, 한식 일반 음식점, 한식 면 요리 전문점, 한식 육류 요리 전문점, 한식 해산물 요리 전문점, 중식 음식점, 일식 음식점, 서양 음식점, 기타 외국식 음식점, 기관 구내식당업, 출장 음식 서비스업, 이동 음식점업, 제과점, 피자/햄버거/샌드위치 및 유사 음식점업, 치킨 전문점, 김밥 및 기타 간이 음식점, 간이 음식 포장 판매 전문점, 주점 및 비알코올 음료점업',
  },
  {
    no: 10,
    title: '정보통신업',
    desctiption:
      '출판업, 영상/오디오 기록물 제작 및 배급업, 방송업, 우편 및 통신업, 컴퓨터 프로그래밍/시스템 통합 및 관리업, 정보서비스업',
  },
  {
    no: 11,
    title: '금융 및 보험업',
    desctiption: '금융업, 보험 및 연금업, 금융 및 보험관련 서비스업',
  },
  {
    no: 12,
    title: '부동산업',
    desctiption: '부동산 임대 및 공급업, 부동산 관련 서비스업',
  },
  {
    no: 13,
    title: '전문, 과학 및 기술 서비스업',
    desctiption:
      '연구개발업, 전문 서비스업, 건축 기술/엔지니어링 및 기타 과학 기술 서비스업, 기타 전문/과학 및 기술 서비스업',
  },
  {
    no: 14,
    title: '사업시설 관리, 사업 지원 및 임대 서비스업',
    desctiption:
      '사업시설 관리 및 조경 서비스업, 사업지원 서비스업, 임대업 (부동산 제외)',
  },
  {
    no: 15,
    title: '공공 행정, 국방 및 사회보장 행정',
    desctiption:
      '입법 및 일반 정부 행정, 사회 및 산업정책 행정, 외무 및 국방 행정, 사법 및 공공 질서 행정, 사회보장 행정',
  },
  {
    no: 16,
    title: '교육 서비스업',
    desctiption:
      '초등 교육기관, 중등 교육기관, 고등 교육기관, 특수학교/외국인학교 및 대안학교, 일반 교습학원, 기타 교육기관, 교육 지원 서비스업',
  },
  {
    no: 17,
    title: '보건업 및 사회복지 서비스업',
    desctiption:
      '병원, 의원, 공중 보건 의료업, 기타 보건업, 거주 복지시설 운영업, 비거주 복지시설 운영업',
  },
  {
    no: 18,
    title: '예술, 스포츠 및 여가관련 서비스업',
    desctiption:
      '창작 및 예술관련 서비스, 도서관/사적지 및 유사 여가 관련 서비스업, 스포츠 서비스업, 유원지 및 기타 오락관련 서비스업',
  },
  {
    no: 19,
    title: '협회 및 단체, 수리 및 기타 개인 서비스업',
    desctiption:
      '산업 및 전문가 단체, 노동조합, 기타 협회 및 단체, 개인 및 소비용품 수리업, 미용/욕탕 및 유사 서비스업, 그 외 기타 개인 서비스업',
  },
  {
    no: 20,
    title: '가구 내 고용활동 및 달리 분류되지 않은 자가소비 생산활동',
    desctiption:
      '가구 내 고용활동, 자가 소비를 위한 가사 생산 활동, 자가 소비를 위한 가사 서비스 활동',
  },
  {
    no: 21,
    title: '국제 및 외국기관',
    desctiption: '주한 외국 공관, 기타 국제 및 외국기관',
  },
];

const fontDirectory = `${RNFS.DocumentDirectoryPath}/fonts`;
export async function cacheFonts(fonts) {
  // Create the font directory if it doesn't exist
  await RNFS.mkdir(fontDirectory);

  return await Promise.all(
    fonts.map(async font => {
      const {fontName, fontUrl} = font;
      const fontPath = `${fontDirectory}/${fontName}.ttf`;

      // Check if the font file has already been cached
      const fileExists = await RNFS.exists(fontPath);
      console.log('fileExists:', fileExists);
      if (fileExists) {
        return fontPath;
      }

      // Download the font file
      console.log('fontUrl:', fontUrl);
      // const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());
      const fontData = await axios
        .get(fontUrl, {
          fontUrl,
          responseType: 'arraybuffer',
        })
        .then(response => response);
      const {promise} = RNFS.downloadFile({
        fromUrl: fontUrl,
        toFile: fontPath,
      });
      const {statusCode} = await promise;
      console.log(statusCode);
      // .then(response => {
      //   // Buffer.from(response.data, 'binary').toString('base64');
      //   // console.log(response);
      //   return response;
      // });
      // const fontData = await axios.get(fontUrl, {responseType: 'arraybuffer'});
      // fs.writeFileSync('font.ttf', new Buffer.from(response.data), 'binary');

      // console.log('fontData:', fontData);
      // Save the font file to the device
      // await RNFS.writeFile(fontPath, new Buffer.from(fontData), 'binary');
      // // await RNFS.writeFile(path, data, 'base64');
      // console.log('fontPath:', fontPath);

      return fontPath;
    }),
  );
}
export const fontList = [
  {
    name: '강원교육모두체 B',
    fontFamily: 'GangwonEduAllBold',
    fontWeight: '700',
  },
  {
    name: '강원교육모두체 L',
    fontFamily: 'GangwonEduAllLight',
    fontWeight: '300',
  },
  {
    name: '강원교육튼튼체 EB',
    fontFamily: 'GangwonEduPowerExtraBold',
    fontWeight: '800',
  },
  {
    name: '나눔고딕 B',
    fontFamily: 'NanumGothicBold',
    fontWeight: '700',
  },
  {
    name: '나눔고딕 R',
    fontFamily: 'NanumGothic',
    fontWeight: '400',
  },
  {
    name: '나눔명조 B',
    fontFamily: 'NanumMyeongjoBold',
    fontWeight: '700',
  },
  {
    name: '나눔명조 EB',
    fontFamily: 'NanumMyeongjoExtraBold',
    fontWeight: '800',
  },
  {
    name: '나눔명조 R',
    fontFamily: 'NanumMyeongjo',
    fontWeight: '400',
  },
  {
    name: '나눔바른고딕 B',
    fontFamily: 'NanumBarunGothicBold',
    fontWeight: '700',
  },
  {
    name: '나눔바른고딕 L',
    fontFamily: 'NanumBarunGothicLight',
    fontWeight: '300',
  },
  {
    name: '나눔바른고딕 R',
    fontFamily: 'NanumBarunGothic',
    fontWeight: '400',
  },
  {
    name: '나눔스퀘어라운드 B',
    fontFamily: 'NanumSquareRoundB',
    fontWeight: '700',
  },
  {
    name: '나눔스퀘어라운드 L',
    fontFamily: 'NanumSquareRoundL',
    fontWeight: '300',
  },
  {
    name: '나눔스퀘어라운드 R',
    fontFamily: 'NanumSquareRoundR',
    fontWeight: '400',
  },
  {
    name: '노토산스 B',
    fontFamily: 'NotoSans-Bold',
    fontWeight: '700',
  },
  {
    name: '노토산스 R',
    fontFamily: 'NotoSans',
    fontWeight: '400',
  },
  {
    name: '배민 연성체',
    fontFamily: 'BMYEONSUNG',
    fontWeight: 'normal',
  },
  {
    name: '세방고딕 B',
    fontFamily: 'SEBANGGothicBold',
    fontWeight: '700',
  },
  {
    name: '세방고딕 R',
    fontFamily: 'SEBANGGothic',
    fontWeight: '400',
  },
  {
    name: '아임크리수진',
    fontFamily: 'ImcreSoojin',
    fontWeight: 'normal',
  },
  {
    name: '애플산돌고딕네오 B',
    fontFamily: 'AppleSDGothicNeoB00',
    fontWeight: '700',
  },
  {
    name: '애플산돌고딕네오 EB',
    fontFamily: 'AppleSDGothicNeoH00',
    fontWeight: '800',
  },
  {
    name: '애플산돌고딕네오 M',
    fontFamily: 'AppleSDGothicNeoM00',
    fontWeight: '500',
  },
  {
    name: '엘리스 디지털배움체 B',
    fontFamily: 'EliceDigitalBaeum-Bd',
    fontWeight: '700',
  },
  {
    name: '엘리스 디지털배움체 R',
    fontFamily: 'EliceDigitalBaeum',
    fontWeight: '400',
  },
  {
    name: '함초롱바탕 B',
    fontFamily: 'HCRBatang-Bold',
    fontWeight: '700',
  },
  {
    name: '함초롱바탕 R',
    fontFamily: 'HCRBatang',
    fontWeight: 'normal',
  },
  {
    name: 'BC카드 B',
    fontFamily: 'BCcardB',
    fontWeight: '700',
  },
  {
    name: 'BC카드 L',
    fontFamily: 'BCcardL',
    fontWeight: '300',
  },
  {
    name: 'G마켓 산스 B',
    fontFamily: 'GmarketSansTTFBold',
    fontWeight: '700',
  },
  {
    name: 'G마켓 산스 L',
    fontFamily: 'GmarketSansTTFLight',
    fontWeight: '300',
  },
  {
    name: 'G마켓 산스 M',
    fontFamily: 'GmarketSansTTFMedium',
    fontWeight: '500',
  },
  {
    name: 'Lato B',
    fontFamily: 'Lato-Bold',
    fontWeight: '700',
  },
  {
    name: 'ONE 모바일고딕 Title',
    fontFamily: 'ONEMobileTitleRegular',
    fontWeight: 'normal',
  },
];
export const colorList = [
  '#ffffff',
  '#bababa',
  '#848484',
  '#454545',
  '#343434',
  '#000000',

  '#fed8d1',
  '#febbb3',
  '#f89183',
  '#e9614c',
  '#e34c2f',
  '#d8422c',

  '#fed9a5',
  '#fdc27f',
  '#fcb464',
  '#fd9637',
  '#f88723',
  '#f47e1c',

  '#fef4c3',
  '#fce9a5',
  '#fed861',
  '#fbc61a',
  '#fec41b',
  '#f8b204',

  '#f6eda8',
  '#eadd6f',
  '#d8cb56',
  '#d7c62e',
  '#c1b20f',
  '#b1ab00',

  '#daf4ca',
  '#cbeca5',
  '#a4dd67',
  '#78c038',
  '#62b623',
  '#4fab16',

  '#c7e4d2',
  '#98c6ae',
  '#71ad87',
  '#37824f',
  '#136a36',
  '#0f6b36',

  '#b9ebe2',
  '#88dace',
  '#4bbdad',
  '#17917a',
  '#0e6d5a',
  '#174a43',

  '#bbdefb',
  '#90caf9',
  '#42a5f5',
  '#1e88e5',
  '#1565c0',
  '#0d47a1',

  '#c5cae9',
  '#9fa8da',
  '#5c6bc0',
  '#3949ab',
  '#283593',
  '#1a237e',

  '#e1bee7',
  '#ce93d8',
  '#ab47bc',
  '#8e24aa',
  '#6a1b9a',
  '#4a148c',

  '#f8bbd0',
  '#f48fb1',
  '#ec407a',
  '#d81b60',
  '#ad1457',
  '#880e4f',

  '#d7ccc8',
  '#bcaaa4',
  '#8d6e63',
  '#6d4c41',
  '#4e342e',
  '#3e2723',
];

export const ar3dSampleList = [
  {
    no: 1,
    source: images.icon_add_text,
    title: '머그컵',
    desctiption: '(375ml)',
  },
  {
    no: 2,
    source: images.btn_armode_exit,
    title: '쇼핑백',
    desctiption: '(16x22x8cm)',
  },
  {
    no: 3,
    source: images.icon_add_text,
    title: '선물상자',
    desctiption: '(30x20x5cm)',
  },
  {
    no: 4,
    source: images.btn_armode_capture_d,
    title: '명함',
    desctiption: '(90x50mm)',
  },
  {
    no: 5,
    source: images.icon_add_text,
    title: '유리병',
    desctiption: '(300ml)',
  },
  {no: 6, source: images.icon_add_text, title: '에코백', desctiption: '(asdf)'},
  {
    no: 7,
    source: images.icon_add_text,
    title: '쇼핑백',
    desctiption: '(20x30x10cm)',
  },
  {
    no: 8,
    source: images.icon_add_text,
    title: '쇼핑백',
    desctiption: '(30x40x15cm)',
  },
];
