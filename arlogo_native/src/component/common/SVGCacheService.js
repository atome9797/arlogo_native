// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const ASYNC_STORAGE_KEY = 'svg-cache';

let data = null;

const loadData = async ASYNC_STORAGE_KEY => {
  const defaultData = {
    svgs: {},
  };

  const result = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
  data = result ? await JSON.parse(result) : defaultData;
  data = {...defaultData, ...data};
};

export default class SVGCacheService {
  static async setSvg(ASYNC_STORAGE_KEY, svg) {
    const oldData = data || {};

    const newData = {
      ...oldData,
      svgs: {
        ...oldData.svgs,
        [ASYNC_STORAGE_KEY]: svg,
      },
    };

    data = newData;

    await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newData));
  }

  static async getSvg(ASYNC_STORAGE_KEY) {
    if (data === null) {
      await loadData(ASYNC_STORAGE_KEY);
    }
    return data.svgs[ASYNC_STORAGE_KEY];
  }
}
