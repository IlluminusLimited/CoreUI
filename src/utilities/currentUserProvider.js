import React from 'react';
import {Facebook} from 'expo';
import {Auth} from 'aws-amplify';

class CurrentUserProvider {
  static signIn(self) {
    Facebook.logInWithReadPermissionsAsync('312632222603423', {
      permissions: ['public_profile', 'email'],
    })
      .then(({type, token, expires, permissions, declinedPermissions}) => {
        console.log("all responsees", type, token, expires, permissions, declinedPermissions);
        if (type === 'success') {
          fetch(`https://graph.facebook.com/me?access_token=${token}`)
            .then(response => response.json())
            .then(json => {
              console.log('Logged in!', `Hi ${json.name}!`);
              // sign in with federated identity
              Auth.federatedSignIn('facebook',
                {token, expires_at: expires},
                {name: json.name, email: json.email})
                .then(credentials => {
                  console.log('get aws credentials', credentials);
                  self.props.navigation.navigate('App');
                })
                .catch(error => console.log("Error doing federatedSignIn", error));
            })
            .catch(error => console.log("Error getting me from facebook", error));
        } else {
          console.log("Facebook did not return successful result, got: ", type)
        }
      })
      .catch(error => console.log("Failed to log in with facebook: ", error))
  };

  // Fetch the token from storage then navigate to our appropriate place
  static getUser(self) {
    Auth.currentAuthenticatedUser()
      .then(currentUser => {
        console.log("CurrentUser:", currentUser);
        self.setState({currentUser: currentUser});
        self.props.navigation.navigate('App');
      })
      .catch(error => {
        console.log("No authenticated user: ", error);
        self.props.navigation.navigate('Auth');
      });

    const federatedInfo = Cache.getItem('federatedInfo');
    console.log("FederatedInfo: ", federatedInfo);
  };
}


export default CurrentUserProvider;