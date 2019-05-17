import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import ListItem from './ListItem';

class List extends Component {


  static defaultProps = {
    children: [],
    getBulletElement: () => null,
    alignBullets: 'center',
  };

  render() {
    let {children, level, getBulletElement, alignBullets} = this.props;

    if (!Array.isArray(children)) {
      children = [children];
    }

    return (
      <View style={this.props.customStyle}>
        {children.map((child, idx) => {
          if (child.type == ListItem) {
            return (
              <View style={[styles.listItemContainer, styles[alignBullets]]}>
                <View style={[styles.bullet]}>{getBulletElement(idx)}</View>
                {child}
              </View>
            );
          }

          return (
            <View style={styles.childContainer}>
              {React.cloneElement(child, {
                level: level + 1,
              })}
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  top: {
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
  },
  bottom: {
    alignItems: 'flex-end',
  },
  childContainer: {
    paddingLeft: 10,
  },
});


export default List;
