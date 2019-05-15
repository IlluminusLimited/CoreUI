class FeaturedImageList {
  static  _toDate(image) {
    return image && image.featured ? new Date(image.featured) : 0;
  }

  static sortImages(images, placeholder) {
    if(!images || images.length === 0){
      return placeholder;
    };
    return images.sort((a, b) => {
      return this._toDate(b) - this._toDate(a);
    })
  }
}

export default FeaturedImageList;