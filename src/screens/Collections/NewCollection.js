import React, {Component} from "react";
import {AsyncStorage, ScrollView, StyleSheet, View} from "react-native";
import {Banner, Button, Dialog, Image, Paragraph, Portal, Text, TextInput} from "react-native-paper";
import ENV from "../../utilities/Environment.js"

class NewCollection extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectionName', 'New Collection'),
    };
  };

  state = {
    collectionName: '',
    collectionDescription: '',
    inputDisabled: false,
    dialogVisible: false,
    responseStatus: '',
    responseError: '',
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
    this.setState({inputDisabled: true});

    await AsyncStorage.multiGet(['userId', 'authToken'])
      .then((values) => {
        console.log(values);
        const userId = values[0][1];
        const authToken = values[1][1];

        console.log("userId and authToken", userId, authToken);
        fetch(`${ENV.API_URI}/v1/users/${userId}/collections`, {
          headers: {
            Authorization: 'Bearer ' + authToken,
            'content-type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(this._prepData())
        })
          .then(response => {
            console.log("CreateCollection response: ", response);
            if (!response.ok) {
              //TODO: Add catch for 401s and redirect to login page.
              response.json()
                .then(json => {
                  this.setState({
                    dialogVisible: true,
                    responseStatus: response.status,
                    responseError: json.error,
                  })
                })
            }
          })
          .then(() => this.props.navigation.navigate('Collections'))
          .catch(error => console.error("createCollection failed:", error));
      })
      .catch(error => console.error("Failed to multiGet from AsyncStorage", error))
  };

  _dismissDialog = async () => {
    this.setState({
      dialogVisible: false,
      inputDisabled: false
    })
  };

  _reportBug = async () => {
    this.props.navigation.navigate('Bug')
  };

  render() {
    return (
      <View style={styles.container}>
        <Portal>
          <Dialog
            visible={this.state.dialogVisible}
            onDismiss={this._dismissDialog}>
            <Dialog.Title>There was a problem saving the collection.</Dialog.Title>
            <Dialog.Content>
              <Paragraph><Text style={styles.boldText}>Status: </Text>
                <Text>{this.state.responseStatus}</Text>
              </Paragraph>
              <Paragraph>
                <Text style={styles.boldText}>Reason: </Text>
                <Text>{this.state.responseError}</Text>
              </Paragraph>

            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._dismissDialog}>Ok</Button>
            </Dialog.Actions>
            {/*<Dialog.Actions>*/}
            {/*<Button onPress={this._dismissDialog}>Report Bug</Button>*/}
            {/*</Dialog.Actions>*/}
          </Dialog>
        </Portal>
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

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold'
  }

});


export default NewCollection;