import React from 'react-native';
import {Constants} from 'expo';

const VALUES = {
  dev: {
    API_URI: "https://api-dev.pinster.io",
    PAGE_SIZE: "5",
    AUTH0_KEY: "DcXt4o786bJpeEWoovMvBSGNhJ70NF1U",
    AUTH0_SITE: "https://dev-pinster-illuminusltd.auth0.com",
  },
  prod: {
    API_URI: "https://api-prod.pinster.io/v1",
    PAGE_SIZE: "30",
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

  return resolvedChannel;
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return VALUES.dev;
  if (env.indexOf('dev') !== -1) return VALUES.dev;
  if (env.indexOf('prod') !== -1) return VALUES.prod;
}


export default getEnvVars(resolveChannel())