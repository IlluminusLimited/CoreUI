class PropsHelper {
  static extract = (props, propName) => {
    const {navigation} = props;
    let value = null;
    if (navigation) {
      value = navigation.getParam(propName, null);
      if (value) {
        return value;
      }
    }

    return props[propName];
  };


  static extractObject = (props, propName) => {
    const {navigation} = props;
    let value = {};
    if (navigation) {
      value = navigation.getParam(propName, null);
      if (value && Object.keys(value).length > 0) {
        return value;
      }
    }
    value = props[propName];
    return value ? value : {};
  };
}

export default PropsHelper