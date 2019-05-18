import React, {Component} from "react";
import {StyleSheet, View, KeyboardAvoidingView} from "react-native";
import {Button, Snackbar, TextInput, Title} from "react-native-paper";
import PropsHelper from "../../utilities/PropsHelper";
import SmartAvatar from "../../components/SmartAvatar";
import Colors from "../../constants/Colors";
import StorageAdapter from "../../utilities/StorageAdapter";


function nullToString(object) {
  return object === null ? '' : object
}

class EditProfile extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'Edit Profile',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      name: PropsHelper.extract(this.props, 'name'),
      bio: PropsHelper.extract(this.props, 'bio'),
      picture: PropsHelper.extract(this.props, 'picture'),
      apiClient: PropsHelper.extract(this.props, 'apiClient'),
      inputDisabled: false,
      snackbarContent: '',
      snackbarVisible: false,

    };

  }

  _saveUser = async () => {
    return this.setState({
      inputDisabled: true
    }, () => {
      this.state.apiClient.patch('/v1/me', {
        data: {
          display_name: nullToString(this.state.name),
          bio: nullToString(this.state.bio),
        }
      }).then(json => {
        return StorageAdapter.save(['name', 'bio'], this.state).then(() => {
          this.setState({
            name: json.display_name,
            bio: json.bio,
            inputDisabled: false,
            snackbarContent: 'Success!',
            snackbarVisible: true,
          })
        })
      }).catch(error => {
        this.setState({
          inputDisabled: false,
          snackbarContent: 'Something went wrong with the request.',
          snackbarVisible: true,
        })
      })
    });
  };


  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={"padding"} keyboardVerticalOffset={20}>
        <View style={styles.container}>
          <View style={styles.userAvatarContainer}>
            <SmartAvatar url={this.state.picture} userName={this.state.name} />
            <Title style={styles.userAvatarUserName}>{this.state.name}</Title>
          </View>
          <View style={styles.inputContainer}>
            <TextInput label={'Display Name'}
                       value={this.state.name}
                       onChangeText={text => this.setState({name: text})}
                       mode={'outlined'}
                       disabled={this.state.inputDisabled}
                       placeholder={`Your display name is what other will see when they look at your profile.`} />

            <TextInput label={'Bio'}
                       multiline={true}
                       value={this.state.bio === '' ? null : this.state.bio}
                       onChangeText={text => {
                         this.setState({bio: text})
                       }}
                       disabled={this.state.inputDisabled}
                       mode={'outlined'}
                       placeholder={`You can use your bio to describe yourself for other traders to get to know you!`} />
          </View>
          <View style={styles.buttonContainer}>
            <Button style={styles.button}
                    color={Colors.turquoise}
                    mode={'contained'}
                    icon={'save'}
                    onPress={this._saveUser}
                    loading={this.state.inputDisabled}
                    disabled={this.state.inputDisabled}>
              Save
            </Button>

          </View>
          <Snackbar
            visible={this.state.snackbarVisible}
            onDismiss={() => this.setState({snackbarVisible: false})}>
            {this.state.snackbarContent}
          </Snackbar>
        </View>

      </KeyboardAvoidingView>
    )
  }
}

// EditProfile.propTypes = {
//   name: PropTypes.string.isRequired,
//   bio: PropTypes.string.isRequired,
//   apiClient: PropTypes.object.isRequired,
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  userAvatarContainer: {
    flex: 2,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: 'blue'
  },
  userAvatarUserName: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold'
  },
  inputContainer: {
    flex: 6,
    padding: 10,
  },
  buttonContainer: {
    flex: 4,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  button: {
    width: '50%'
  }
});


export default EditProfile;