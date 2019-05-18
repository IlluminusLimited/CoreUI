import React from 'react';
import {View} from "react-native";
import {Button} from "react-native-paper";
import PropTypes from "prop-types";
import Colors from "../constants/Colors";

//TODO: Make this go through a loading state and stuff after its clicked
export default class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading,
      buttonText: this.props.loading ? 'Loading...' : 'Load more',
      nextPage: this.props.nextPage,
      fetchMoreItems: this.props.fetchMoreItems
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nextPage) {
      return this.setState({
        loading: nextProps.loading,
        buttonText: nextProps.loading ? 'Loading...' : 'Load more',
        nextPage: nextProps.nextPage,
        fetchMoreItems: nextProps.fetchMoreItems,
      })
    }
    return this.setState({
      loading: false,
      buttonText: '',
      nextPage: null,
    })
  }


  _buttonPress = () => {
    return this.setState({
        loading: true,
        buttonText: 'Loading...'
      }, () => {
        return this.state.fetchMoreItems();
      }
    );
  };

  _pressAgain = () => {
    return this.setState({
      buttonText: 'Still loading...'
    })
  };

  render() {
    return (
      <View>
        {(this.state.nextPage === '' || this.state.nextPage === null || this.state.nextPage === undefined) ?
          (
            null
          ) : (
            <View style={this.props.style}>
              {this.state.loading ? (
                <Button loading
                        mode={'contained'}
                        dark={true}
                        onPress={this._pressAgain}
                        icon={this.state.favorite}
                        color={Colors.turquoise}>
                  {this.state.buttonText}
                </Button>
              ) : (
                <Button
                  mode={'contained'}
                  dark={true}
                  onPress={this._buttonPress}
                  color={Colors.turquoise}>
                  {this.state.buttonText}
                </Button>
              )}
            </View>
          )}
      </View>
    )
  }
}

LoadMoreButton.propTypes = {
  nextPage: PropTypes.string,
  style: PropTypes.object,
  fetchMoreItems: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};