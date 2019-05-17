import React from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {withNavigation} from "react-navigation";

import {Divider, Headline, Paragraph, Subheading, Text} from "react-native-paper";

class AboutUs extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'About Us',
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
        <Headline>Who we are</Headline>
        <Paragraph>Pinster was created by a group of DI alumni and friends who lovingly give our
          free time to this project in order to create a better pin trading experience for everyone.
          It is our greatest pleasure to give back to the DI community.
        </Paragraph>
        <Divider />
        <Headline>Our Values</Headline>
        <Paragraph>
          We stand behind these core values:
          Community First
          The DI pin trading community is at the heart and soul of our project. All its members are valuable to us and deserve the best pin trading experience possible.
          We believe in fostering ties of strength and friendship between DIers across the world through pin trading.
          Fair Pin Trading
          We encourage and support fair trades between all parties.
          We believe that everyone has the right to a positive pin trading experience. We expect those in our community to always do their best to be kind, courteous, fair, and polite.
          Do No Harm
          We believe we have a responsibility to protect the environment by properly disposing of pin bags and other pin-trading-related packaging/trash.
        </Paragraph>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      margin: 20,
    },
    userInfo: {
      marginTop: 35,
      flex: 1,
    },
    userAttribute: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    }
  }
);

export default withNavigation(AboutUs);