import {makeAutoObservable, runInAction} from 'mobx';
import {getLocal, setLocal} from '../utils/libs';

class Store {
  changeStorage = false;
  myStorage = [];
  currentEditCapture = {};
  sliderValues = {};
  resizeWidth = false;
  resizeHeight = false;
  resizeWH = false;
  networkStatus = true;
  sceneRef = null;
  constructor() {
    makeAutoObservable(this);
  }
  // get double() {
  //   return this.myStorage;
  // }
  getMyStorage = async () => {
    const _myStorage = (await getLocal('myStorage')) || [];
    console.log('_myStorage:', _myStorage?.length);
    // this.myStorage = _myStorage.slice(0, 5);
    this.myStorage = _myStorage;
  };
  setMyStorage = async value => {
    this.myStorage = value;
    await setLocal('myStorage', value);
    // this.myStorage = value;
  };
  setChangeStorage = value => {
    this.changeStorage = value;
  };
  setCurrentEditCapture = value => {
    this.currentEditCapture = value;
  };
  setSliderValues = value => {
    this.sliderValues = value;
  };
  setResizeValues = (prop, value) => {
    if (prop === 'w') {
      this.resizeWidth = value;
    }
    if (prop === 'h') {
      this.resizeHeight = value;
    }
    if (prop === 'wh') {
      this.resizeWH = value;
    }
  };
  setArInitialized = value => {
    this.arInitialized = value;
  };
  setSceneRef = value => {
    this.sceneRef = value;
  };
  setNetworkStatus = value => {
    this.networkStatus = value;
  };
}

export default new Store();
