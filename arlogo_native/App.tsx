import React, {useEffect, useState} from 'react';
import Navigator from './src/navigation';
import SplashScreen from 'react-native-splash-screen';
import './src/utils/i18n';
import {Provider} from 'mobx-react';
import Store from './src/store';
import NetInfo from '@react-native-community/netinfo';
import LottieSplashScreen from './src/component/common/splashScreen';
import {enableFreeze} from 'react-native-screens';

enableFreeze(true);
const App = () => {
  const [mounted, mountedSet] = useState(false);
  const [isLoading, isLoadingSet] = useState(false);
  // const {store} = useStores();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      Store.setNetworkStatus(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    const loadInit = async () => {
      await Store.getMyStorage();
      mountedSet(true);
    };
    if (!mounted) {
      loadInit();
    }
  });
  return (
    <Provider store={Store}>
      {!isLoading || !mounted ? (
        <LottieSplashScreen isLoadingSet={isLoadingSet} />
      ) : (
        <Navigator />
      )}
    </Provider>
  );
};
export default App;
