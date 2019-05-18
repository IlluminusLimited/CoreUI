import React, {Component} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Dialog, Paragraph, Portal, Text, TextInput} from "react-native-paper";
import CurrentUserProvider from "../../utilities/CurrentUserProvider";
import ApiClient from "../../utilities/ApiClient";

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
    new ApiClient(await CurrentUserProvider.loadUser())
      .post(`/v1/users/:user_id/collections`, this._prepData())
      .then(() => this.props.navigation.navigate('Collections', {refresh: true}))
      .catch(error => {
        //TODO: The error dialog should be shown here.
        console.error("createCollection failed:", error)
      });
  };

  _dismissDialog = async () => {
    this.setState({
      snackbarVisible: false,
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
              {/*<Button onPress={this._dismissDialog}>Report Bug</Button>*/}
              <Button onPress={this._dismissDialog}>Ok</Button>
            </Dialog.Actions>
            {/*<Dialog.Actions>*/}
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