class ResponseMapper {
  static asyncStorageUserParams = () => {
    return ['picture',
      'email',
      'userId',
      'name',
      'bio',
      'userCollectionsUrl',
      'userImagesUrl',
      'imageQuality'
    ];
  };

  static allUserParams = () => {
    return ['authToken', 'refreshToken', ...this.asyncStorageUserParams()]
  };

  static me = (json) => {
    return {
      userId: json.id,
      name: json.display_name,
      bio: json.bio,
      userCollectionsUrl: json.collections_url,
      userImagesUrl: json.images_url
    }
  };
}

export default ResponseMapper;