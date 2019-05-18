import React, {Component} from "react";
import {AsyncStorage, ScrollView, StyleSheet, View} from "react-native";
import {Banner, Button, Dialog, Image, Paragraph, Portal, Text, TextInput} from "react-native-paper";
import ENV from "../../utilities/Environment.js"
import PropTypes from "prop-types";
import SmartAvatar from "./SmartAvatar";

class ApiCallErrorDialog extends Component {
  state = {
    dialogVisible: true,
    responseStatus: '',
    responseError: '',
  };

  _dismissDialog = async () => {
    this.setState({
      snackbarVisible: false,
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <Portal>
          <Dialog
            visible={this.state.dialogVisible}
            onDismiss={this._dismissDialog}>
            <Dialog.Title>There was a problem {this.props.action}</Dialog.Title>
            <Dialog.Content>
              <Paragraph><Text style={styles.boldText}>Status: </Text>
                <Text>{this.props.errorCause}</Text>
              </Paragraph>
              <Paragraph>
                <Text style={styles.boldText}>Reason: </Text>
                <Text>{this.props.errorMessage}</Text>
              </Paragraph>
              <Paragraph>
                <Text style={styles.boldText}>Explanation: </Text>
                <Text>{this.props.explanation}</Text>
              </Paragraph>

            </Dialog.Content>
            <Dialog.Actions>
              {/*<Button onPress={this._dismissDialog}>Report Bug</Button>*/}
              <Button onPress={this._dismissDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    )
  }
}

ApiCallErrorDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  action: PropTypes.string.isRequired,

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold'
  }
});


export default ApiCallErrorDialog;