import React from 'react';
import {Dimensions, ScrollView, StyleSheet} from "react-native";
import {withNavigation} from "react-navigation";

import {Card, Paragraph, Subheading} from "react-native-paper";


class AboutUs extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null,
    };
  };

  state = {
    loaded: false,
    userId: this.props.userId,
    collections: [],
    currentUser: {}
  };


  render() {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.surface}>
          <Card.Title title="About Us" />
          <Card.Content>
            <Card.Cover source={require('../../assets/images/pinster_header.png')} />

            <Subheading>Who we are:</Subheading>
            <Paragraph>
              Pinster was created by a group of DI alumni and friends who lovingly give our free time to
              this project in order to create a better pin trading experience for everyone.
            </Paragraph>
            <Paragraph>It is our greatest pleasure to give back to the DI community.</Paragraph>
          </Card.Content>
        </Card>
        <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      margin: 20,
      paddingTop: 20
    },
    userInfo: {
      marginTop: 35,
      flex: 1,
    },
    userAttribute: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },

    surface: {
      flex: 1,
      margin: 10,
      elevation: 4,
    },
  }
);

export default withNavigation(AboutUs);