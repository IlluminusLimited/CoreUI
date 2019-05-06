import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, TouchableOpacity, View} from 'react-native';
import {Portal, Surface, Text, FAB} from 'react-native-paper';
import PropTypes from "prop-types";
import {withNavigation} from "react-navigation";
import ImageServiceImage from "../ImageServiceImage";

class CollectableItem extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      collectable: this.props.collectableData,
      open: false,
    };
  }

  _onPress = async () => {
    console.log("Pressed for id:", this.state.collectable.id);
    this.props.navigation.navigate('Collectable', {collectableId: this.state.collectable.id})
    // .catch(error => console.error("There was an error navigating", error))
  };

  //TODO: Implement check for thumbnailable before asking for specific image size
  //TODO: image name and description are hidden in the api, need to populate those fields before this will work.
  //TODO: Card content gets hidden when pagination happens.
  render() {
    return (
      <React.Fragment>
        {this.state.collectable.isPadding ? (
          <View style={styles.container} />
        ) : (
          <React.Fragment>

            <Portal>
              <FAB.Group
                open={this.state.open}
                icon={this.state.open ? 'today' : 'add'}
                actions={[
                  {icon: 'add', onPress: () => console.log('Pressed add')},
                  {icon: 'star', label: 'Star', onPress: () => console.log('Pressed star')},
                  {icon: 'email', label: 'Email', onPress: () => console.log('Pressed email')},
                  {icon: 'notifications', label: 'Remind', onPress: () => console.log('Pressed notifications')},
                ]}
                onStateChange={({open}) => this.setState({open})}
                onPress={() => {
                  if (this.state.open) {
                    // do something if the speed dial is open
                  }
                }}
              />
            </Portal>
            <TouchableOpacity activeOpacity={0.7} onPress={this._onPress}>
              <Surface style={styles.surface}>
                {console.log(`Rendering collectableItem ${this.state.collectable.name}`)}
                {/*Implement check for thumbnailable before asking for specific image size*/}
                <ImageServiceImage style={styles.image}
                                   imageData={this.state.collectable.images[0]}
                                   dimensions={'200x200'} />
                <Text numberOfLines={2}>{this.state.collectable.name}</Text>
              </Surface>
            </TouchableOpacity>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

CollectableItem.propTypes = {
  collectableData: PropTypes.object.isRequired,
};


const styles = StyleSheet.create({
  container: {
    width: 100,
    marginBottom: 10,
  },
  image: {
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  surface: {
    padding: 4,
    height: 145,
    width: 110,
    marginBottom: 10,
    justifyContent: 'flex-end',
    elevation: 4,
  },
});

export default withNavigation(CollectableItem);
