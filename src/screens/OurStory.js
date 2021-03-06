import React from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {Card, Divider, Paragraph, Subheading} from "react-native-paper";
import {withNavigation} from "react-navigation";
import Colors from "../constants/Colors";


class OurStory extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: "Our Story",
      headerStyle: {
        backgroundColor: Colors.yellow
      },
      headerTitleStyle: {
        color: '#fff'
      }
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

          <Card style={styles.card}>
            <Card.Title title="Our Core Values" />
            <Card.Content>
              <Card.Cover source={require('../../assets/images/our_core_values.png')} />
              <View style={{marginTop: 10}}/>
              <Subheading style={styles.subheading}>Community First</Subheading>
              <Paragraph>{'\u2022 '}The DI pin trading community is at the heart and soul of our project.
                All its members are valuable to us and deserve the best pin trading experience possible.
              </Paragraph>
              <Paragraph>{'\u2022 '}We believe in fostering ties of strength and friendship between DIers across the
                world through pin trading.</Paragraph>
              <Divider style={styles.divider} />
              <Subheading style={styles.subheading}>Fair Pin Trading</Subheading>
              <Paragraph>{'\u2022 '}We encourage and support fair trades between all parties.</Paragraph>
              <Paragraph>{'\u2022 '}We believe that everyone has the right to a positive pin trading experience. We
                expect those in our community to always do their best to be kind, courteous, fair, and
                polite.</Paragraph>
              <Divider style={styles.divider}/>
              <Subheading style={styles.subheading}>Do No Harm</Subheading>
              <Paragraph>{'\u2022 '}We believe we have a responsibility to protect the environment by properly disposing
                of pin bags and other pin-trading-related packaging/trash.</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Title title="Code of Conduct" />
            <Card.Content>
              <Card.Cover source={require('../../assets/images/Astrolabe2.png')} />
              <View style={{marginTop: 10}}/>
              <Subheading style={styles.subheading}>Help us make pin trading a great experience for all!</Subheading>
              <Paragraph>{'\u2022 '}I will trade pins fairly with all other traders I encounter and will not take
                advantage of other pin traders in any way.</Paragraph>
              <Paragraph>{'\u2022 '}I will treat others with patience, kindness, and courtesy.</Paragraph>
              <Paragraph>{'\u2022 '}I will respect another pin trader’s right to decline a trade.</Paragraph>
              <Paragraph>{'\u2022 '}I will pick up after myself and throw away all pin trading trash
                I create.</Paragraph>
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
      // paddingTop: 20
    },
    userInfoContainer: {
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
      // margin: 10,
      marginBottom: 10,
      elevation: 4,
    },
    subheading: {
      fontWeight: 'bold'
    },
    divider: {
      marginVertical: 10
    },
    bulletPoint: {
      textAlignVertical: 'bottom',
      fontSize: 16,
      includeFontPadding: false,
    },
  }
);

export default withNavigation(OurStory);