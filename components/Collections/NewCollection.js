import React, {Component} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Button, TextInput} from "react-native-paper";

class NewCollection extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectionName', ''),
    };
  };

  state = {
    collectionName: '',
  };


  _updateCollectionName(name) {
    this.props.navigation.setParams({collectionName: name});
    this.setState(
      {
        collectionName: name,
      }
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <TextInput label={'Name'}
                   value={this.state.collectionName}
                   onChangeText={text => this._updateCollectionName(text)} />

        <Button icon={'save'} mode={'contained'} onPress={() => console.log("Save pressed")}>
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