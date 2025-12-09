import React from 'react';
import {AppRegistry} from 'react-native';
import {createRoot} from 'react-dom/client';
import App from './src/App';
import {name as appName} from './app.json';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Get the root element
const rootElement = document.getElementById('root');

if (rootElement) {
  // Use React DOM for web
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}
