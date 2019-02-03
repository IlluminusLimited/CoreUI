import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {AppLoading} from 'expo';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import Amplify from 'aws-amplify';

import aws_exports from './src/aws-exports';

Amplify.configure(aws_exports);

class App extends React.Component {
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
    height: 100 + '%'
  }
});

export default App