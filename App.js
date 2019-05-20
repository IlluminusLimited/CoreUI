import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {AppLoading, Linking} from 'expo';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
// see https://github.com/facebook/react-native/issues/14796
import {Buffer} from "buffer";
// see https://github.com/facebook/react-native/issues/16434
import {URL, URLSearchParams} from "whatwg-url";
import ENV from "./src/utilities/Environment";
import CurrentUserProvider from "./src/utilities/CurrentUserProvider";
import CurrentUser from "./src/utilities/CurrentUser";
import {UserContext} from "./src/contexts/UserContext";

global.Buffer = Buffer;
global.URL = URL;
global.URLSearchParams = URLSearchParams;


class App extends React.Component {
  constructor(props) {
    super(props);

    this.updateCurrentUser = (newCurrentUser) => {
      return this.setState({
        currentUser: newCurrentUser
      })
    };

    this.state = {
      isLoadingComplete: false,
      currentUser: new CurrentUser(),
      updateCurrentUser: this.updateCurrentUser
    };
  }


  _loadResourcesAsync = async () => {
    return Promise.all([
      CurrentUserProvider.loadUser(),
      Linking.addEventListener('url', this._handleLinking),
      Linking.getInitialURL().then(this._handleLinking),
    ]).then(values => {
      this.setState({
        currentUser: values[0]
      })
    });
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.error(error);
  };

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true});
  };

  _handleLinking = async (url) => {
    this.setState({url});
    let {path, queryParams} = Linking.parse(url);
    console.log("linked from url", url);
    console.log(`Linked to app with path`, path);
    console.log("Linking data", queryParams);
  };

  componentDidMount() {
    console.debug("ENV", ENV);
  }

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

    return (
      <PaperProvider>
        <UserContext.Provider value={this.state}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        </UserContext.Provider>
      </PaperProvider>
    );
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