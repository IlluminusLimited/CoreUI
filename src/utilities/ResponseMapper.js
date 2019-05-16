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
      'favoriteCollectionCollectableCollectionsUrl'
    ];
  }

  static allUserParams() {
    return ['authToken', 'refreshToken', ...this.asyncStorageUserParams()]
  }

  static me(json){
    return {
      userId: json.id,
      name: json.display_name,
      bio: json.bio,
      userCollectionsUrl: json.collections_url,
      userCollectionsSummaryUrl: json.collections_summary_url,
      userImagesUrl: json.images_url
    }
  }

  static favoriteCollectionParams() {
    return ['favoriteCollectionId',
      'favoriteCollectionName',
      'favoriteCollectionDescription',
      'favoriteCollectionCollectableCollectionsUrl',
      'favoriteCollectionImagesUrl',
      'favoriteCollectionUrl',
    ];
  }

  static favoriteCollection(json) {
    return {
      favoriteCollectionId: json.id,
      favoriteCollectionName: json.name,
      favoriteCollectionDescription: json.description,
      favoriteCollectionCollectableCollectionsUrl: json.collectable_collections_url,
      favoriteCollectionImagesUrl: json.images_url,
      favoriteCollectionUrl: json.url,
    }
  }
}

export default ResponseMapper;