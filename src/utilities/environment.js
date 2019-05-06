import React from 'react-native';
import {Constants} from 'expo';

const VALUES = {
  dev: {
    API_URI: "https://api-dev.pinster.io/v1",
    PAGE_SIZE: "5",
    FACEBOOK_CLIENT_ID: "312632222603423",
    AUTH0_KEY: "DcXt4o786bJpeEWoovMvBSGNhJ70NF1U",
    AUTH0_SITE: "https://dev-pinster-illuminusltd.auth0.com"
  },
  prod: {
    API_URI: "https://api-prod.pinster.io/v1",
    PAGE_SIZE: "30",
    FACEBOOK_CLIENT_ID: "206154813532206"
  }
};

function resolveChannel() {
  const channel = Constants.manifest.releaseChannel;
  let resolvedChannel = channel;
  if (__DEV__) {
    if (channel === null || channel === undefined || channel === '') {
      resolvedChannel = 'dev';
    }
  }
  else {
    resolvedChannel = 'prod'
  }

  console.log("Resolved channel is", resolvedChannel);
  return resolvedChannel;
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return VALUES.dev;
  if (env.indexOf('dev') !== -1) return VALUES.dev;
  if (env.indexOf('prod') !== -1) return VALUES.prod;
}


export default getEnvVars(resolveChannel())