const Home = {
  template: `
    <div class="mt-5 pt-3">
      <b-card no-body header="Home" class="border-0" header-class="p-1">
        <b-card-body class="mb-1">
          <b-list-group>
            <b-list-group-item to="/optinoExplorer/all">Optino Explorer</b-list-group-item>
            <b-list-group-item to="/feedsExplorer/all">Feeds Explorer</b-list-group-item>
            <b-list-group-item to="/tokensExplorer/all">Tokens Explorer</b-list-group-item>
          </b-list-group>
          <b-card-text class="mt-5">
            This is still work in progress. You will need a browser with web3 injection, e.g., using the MetaMask addon. In your web3 wallet, switch to the Ropsten testnet.
            <br />
            <div v-if="!connect">Please click on the power button <b-icon-power variant="primary" shift-v="-1" font-scale="1.5"></b-icon-power> on the top right to connect via MetaMask.</div>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  `,
  data: function () {
    return {
    }
  },
  computed: {
    connect() {
      return store.getters['connection/connect'];
    },
  },
};
