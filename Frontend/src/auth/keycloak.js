import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'bid-compliance',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'bid-compliance-frontend',
};

export const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
