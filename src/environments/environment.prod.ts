import * as keys from './key';

export const environment = {
  firebase: {
    projectId: keys.projectId,
    appId: keys.appId,
    storageBucket: keys.storageBucket,
    apiKey: keys.apiKey,
    authDomain: keys.authDomain,
    messagingSenderId: keys.messagingSenderId,
  },
  production: true,
};
