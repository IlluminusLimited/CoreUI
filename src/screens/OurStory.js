import React from 'react';
import {View, ScrollView, StyleSheet} from "react-native";
import {withNavigation} from "react-navigation";

import {Card, Paragraph, Subheading, Title} from "react-native-paper";


class OurStory extends React.Component {
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
        <View style={styles.infoContainer}>
          <Title>Our Story</Title>

          <Card style={styles.card}>
            <Card.Title title="Our Core Values" />
            <Card.Content>
              <Card.Cover source={require('../../assets/images/our_core_values.png')} />

              <Subheading>We stand behind these core values</Subheading>
              <Paragraph>
                Community First
              </Paragraph>
                <Paragraph>The DI pin trading community is at the heart and soul of our project.
                  All its members are valuable to us and deserve the best pin trading experience possible.
                </Paragraph>
              <Paragraph>It is our greatest pleasure to give back to the DI community.</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Who we are" />
            <Card.Content>
              <Card.Cover source={require('../../assets/images/pinster_header.png')} />
              <Paragraph>
                Pinster was created by a group of DI alumni and friends who lovingly give our free time to
                this project in order to create a better pin trading experience for everyone.
              </Paragraph>
              <Paragraph>It is our greatest pleasure to give back to the DI community.</Paragraph>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
    },
    infoContainer: {
      flex: 1,
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
    card: {
      flex: 1,
      margin: 10,
      elevation: 4,
    },
  }
);

export default withNavigation(OurStory);