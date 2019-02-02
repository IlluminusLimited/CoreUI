import React, {Component} from "react";
import {AsyncStorage, ScrollView, StyleSheet, View} from "react-native";
import {Button, TextInput} from "react-native-paper";

class NewCollection extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectionName', ''),
    };
  };

  state = {
    collectionName: '',
    collectionDescription: '',
    inputDisabled: false,
  };


  _updateCollectionName(name) {
    this.props.navigation.setParams({collectionName: name});
    this.setState(
      {
        collectionName: name,
      }
    )
  }

  _prepData() {
    return {
      data: {
        name: this.state.collectionName,
        description: this.state.collectionDescription
      }
    };
  };

  _createCollection = async () => {
    await AsyncStorage.setItem('userId', 'ass');
    await AsyncStorage.setItem('authToken', 'ass');
    this.setState({inputDisabled: true});

    await AsyncStorage.multiGet(['userId', 'authToken'])
      .then((values) => {
        console.log(values);
        const userId = values[0][1];
        const authToken = values[1][1];

        console.log("userId and authToken", userId, authToken);
        fetch(`https://api-dev.pinster.io/v1/users/${userId}/collections`, {
          headers: {
            Authorization: 'Bearer ' + authToken,
            'content-type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(this._prepData())
        })
          .then(response => console.log(response))
          // .then(() => this.props.navigation.navigate('Collections'))
          .catch(error => console.error("createCollection failed:", error));
      })
      .catch(error => console.error("Failed to multiGet from AsyncStorage", error))
  };


  render() {
    return (
      <ScrollView style={styles.container}>
        <TextInput label={'Name'}
                   value={this.state.collectionName}
                   onChangeText={text => this._updateCollectionName(text)}
                   disabled={this.state.inputDisabled} />

        <TextInput label={'Description'}
                   value={this.state.collectionDescription}
                   onChangeText={text => {
                     this.setState({collectionDescription: text})
                   }}
                   disabled={this.state.inputDisabled} />

        <Button icon={'save'}
                mode={'contained'}
                onPress={this._createCollection}
                loading={this.state.inputDisabled}
                disabled={this.state.inputDisabled}>
          Save
        </Button>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});


export default NewCollection;