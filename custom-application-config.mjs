import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptions}
 */

const config = {
  name: 'Custom application1',
  entryPointUriPath:'Channels1',
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'new_custom', 
    },
    production: {
      applicationId: 'cle73yb95000auo01a2jamndx',
      url: 'https://custom-order.vercel.app',
    },
  },

  oAuthScopes: {
    view: ['view_orders','view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'orders',
      defaultLabel: 'Orders',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
