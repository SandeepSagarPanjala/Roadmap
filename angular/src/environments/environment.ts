export const environment = {
  production: false,
  apiUrl: '/api', // Because we use a proxy natively, this stays a relative path
  tokenStorageKey: 'nexus_access_token' // Industry standard to namespace your LocalStorage keys
};
