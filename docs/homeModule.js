const Home = {
  template: `
    <div class="mt-5 pt-3">
      <b-card no-body header="Home" class="border-0" header-class="p-1">
        <b-card-body class="p-1 mt-5">
          <b-list-group>
            <b-list-group-item to="/optinoExplorer/all">Optino Explorer</b-list-group-item>
            <b-list-group-item to="/feedsExplorer/all">Feeds Explorer</b-list-group-item>
            <b-list-group-item to="/tokensExplorer/all">Tokens Explorer</b-list-group-item>
          </b-list-group>
          <b-card-text class="mt-5">
            This is still work in progress. You will need a browser with web3 injection, e.g., using the MetaMask addon. In your web3 wallet, switch to the Ropsten testnet.
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  `,
};
