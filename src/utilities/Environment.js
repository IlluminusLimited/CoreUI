import React from 'react-native';
import Constants from 'expo-constants';

const VALUES = {
  dev: {
    API_URI: "https://api-dev.pinster.io",
    PAGE_SIZE: "30",
    AUTH0_KEY: "DcXt4o786bJpeEWoovMvBSGNhJ70NF1U",
    AUTH0_SITE: "https://dev-pinster-illuminusltd.auth0.com",
  },
  prod: {
    API_URI: "https://api-prod.pinster.io",
    PAGE_SIZE: "90",
    AUTH0_KEY: '0S0AXbWej3yi1zjINt87h3K9ugj0F6YN',
    AUTH0_SITE: 'https://pinster-illuminusltd.auth0.com'
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