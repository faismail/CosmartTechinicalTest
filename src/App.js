import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './Router';
import SplashScreen from 'react-native-splash-screen';
import { ModalPortal } from 'react-native-modals';


const App = () => {
  useEffect(()=> {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Router/>
      <ModalPortal />
    </NavigationContainer>
  );
};

export default App;
