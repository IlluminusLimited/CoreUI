import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, Text, Card, Title, Paragraph} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import PropTypes from 'prop-types'
import Layout from "../../constants/Layout";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Collectable extends Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('collectableName', ''),
    };
  };


  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const collectableId = navigation.getParam('collectableId', null);
    this.state = {
      collectableId: (collectableId ? collectableId : this.props.collectableId),
      collectable: {},
      loaded: false
    };
  }

  componentDidMount() {
    this._fetchCollectable();
  }

  _fetchCollectable() {
    fetch(`https://api-dev.pinster.io/v1/pins/${this.state.collectableId}`)
      .then(response => response.json())
      .then(collectable => {
        console.log("We got back this thing", collectable);
        this.props.navigation.setParams({collectableName: collectable.name});
        this.setState({
          collectable: collectable,
          loaded: true
        });
      })
      .catch(error => console.error('error getting collectable', error));
  }

  _renderItem({item, index}) {
    return (
      <Card style={styles.card}>
        <Card.Cover source={{uri: item.storage_location_uri}} />
        <Card.Content style={styles.cardContent}>
          <Title>{item.name}</Title>
          <Paragraph>{item.description}</Paragraph>
        </Card.Content>
      </Card>
    );
  }


  render() {
    return (
      <React.Fragment>
        {
          this.state.loaded ? (
            this.state.collectable.length !== 0 ? (
              <View style={styles.container}>
                <Appbar.Header style={styles.appbar} statusBarHeight={0}>
                  <Appbar.BackAction onPress={console.log('Back button pressed')} />
                  <Appbar.Content
                    title={'Name of collectable'}
                    subtitle={
                      'Some long winded description maybe'
                    }
                  />
                </Appbar.Header>

                <View style={styles.collectable}>
                  <Carousel
                    ref={(c) => {
                      this._carousel = c;
                    }}
                    data={this.state.collectable.images}
                    renderItem={this._renderItem}
                    sliderWidth={Layout.window.width}
                    itemWidth={Layout.window.width}
                  />

                  <Text>Name: {this.state.collectable.name}</Text>
                  <Paragraph>Description: {this.state.collectable.description}</Paragraph>
                </View>
              </View>
            ) : (
              <Text>There was an error getting shit</Text>
            )
          ) : (
            <Text>Loading</Text>
          )
        }
      </React.Fragment>
    );
  }
}

Collectable.propTypes = {
  collectableId: PropTypes.string,
  collectableName: PropTypes.string
};

const styles = StyleSheet.create({
  cardContent: {},
  card: {
    marginTop: 5,
    marginBottom: 5
  },
  container: {
    flex: 1
  },
  appbar: {
    flex: 1
  },
  collectable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
});

export default Collectable;
