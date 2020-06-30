const routes = [{
    path: '/optinoExplorer/:param',
    component: OptinoExplorer,
    name: 'Optinos',
  }, {
    path: '/feedsExplorer/:param',
    component: FeedsExplorer,
    name: 'Feeds',
  }, {
    path: '/tokensExplorer/:param',
    component: TokensExplorer,
    name: 'Tokens',
  }, {
    path: '*',
    component: Home,
    name: ''
  }
];
