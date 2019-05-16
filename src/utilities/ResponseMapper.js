class ResponseMapper {
  static asyncStorageUserParams() {
    return ['picture',
      'email',
      'userId',
      'name',
      'bio',
      'userCollectionsUrl',
      'userCollectionsSummaryUrl',
      'userImagesUrl',
      'favoriteCollectionId',
    ];
  }

  static allUserParams() {
    return ['authToken', ...this.asyncStorageUserParams()]
  }

  static me(meJson){
    return {
      userId: meJson.id,
      name: meJson.display_name,
      bio: meJson.bio,
      userCollectionsUrl: meJson.collections_url,
      userCollectionsSummaryUrl: meJson.collections_summary_url,
      userImagesUrl: meJson.images_url
    }
  }
}

export default ResponseMapper;