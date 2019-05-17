import React, {Component} from 'react';
import List from './List';
import {Text} from "react-native-paper";
import {letterize, romanize} from "./NumbersHelper";

const ONE = '1';
const I = 'I';
const i = 'i';
const A = 'A';
const a = 'a';

class OrderedList extends Component {

  static defaultProps = {
    children: [],
    level: 0,
    type: ONE,
  };

  getBulletElement = idx => {
    const {type, level} = this.props;
    idx += 1;
    let formattedIdx;

    switch (type) {
      case ONE:
        formattedIdx = idx;
        break;
      case I:
        formattedIdx = romanize(idx);
        break;
      case i:
        formattedIdx = romanize(idx).toLowerCase();
        break;
      case A:
        formattedIdx = letterize(idx);
        break;
      case a:
        formattedIdx = letterize(idx).toLowerCase();
        break;
      default:
        throw 'Prop type is invalid!';
    }

    return <Text style={this.props.customBulletStyle}>{formattedIdx}.</Text>;
  };

  render() {
    const {children, type, level, customStyle, alignBullets} = this.props;

    return (
      <List
        type={type}
        level={level}
        getBulletElement={this.getBulletElement}
        customStyle={customStyle}
        alignBullets={alignBullets}
      >
        {children}
      </List>
    );
  }
}

export default OrderedList;
