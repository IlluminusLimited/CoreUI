import React from 'react';
import {Platform, View, StatusBar, StyleSheet} from 'react-native';
import {AppLoading} from 'expo';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import Amplify from 'aws-amplify';
import Text from './constants/CustomText';

import aws_exports from './src/aws-exports';
// see https://github.com/facebook/react-native/issues/14796
import {Buffer} from "buffer";
// see https://github.com/facebook/react-native/issues/16434
import {URL, URLSearchParams} from "whatwg-url";

Amplify.configure(aws_exports);

global.Buffer = Buffer;

global.URL = URL;
global.URLSearchParams = URLSearchParams;


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
      'OpenSans-BoldItalic': require('./assets/fonts/OpenSans-BoldItalic.ttf'),
      'OpenSans-ExtraBold': require('./assets/fonts/OpenSans-ExtraBold.ttf'),
      'OpenSans-Italic': require('./assets/fonts/OpenSans-Italic.ttf'),
      'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
      'OpenSans-LightItalic': require('./assets/fonts/OpenSans-LightItalic.ttf'),
      'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
      'OpenSans-SemiBoldItalic': require('./assets/fonts/OpenSans-SemiBoldItalic.ttf'),
    });

    this.setState({ fontLoaded: true });
  };
  state = {
    isLoadingComplete: false
  };

  _loadResourcesAsync = async () => {
    return Promise.all([]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true});
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    else {
      return (
        <PaperProvider>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        </PaperProvider>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
  }
});

export default App