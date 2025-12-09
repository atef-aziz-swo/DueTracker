import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {AppNavigator} from './navigation/AppNavigator';
import {initializeNotifications} from './services/notifications';
import {colors} from './utils/theme';

function App(): JSX.Element {
  useEffect(() => {
    // Initialize push notifications
    initializeNotifications();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <AppNavigator />
    </>
  );
}

export default App;
