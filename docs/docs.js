const Docs = {
  template: `
    <div class="mt-5 pt-3">
      <b-card no-body header="Documentation" class="border-0" header-class="p-1">
        <b-tabs pills card vertical end>
          <!--
          <b-tab title="Start">
            <b-card-text>Start</b-card-text>
          </b-tab>
          -->
          <b-tab title="Formulae" active>
            <b-card-text>
              <h5 class="mb-3">Payoff Formulae</h5>
              <h6>Vanilla Call Payoff</h6>
              <pre class="bg-light mx-4 my-2 p-2" style="color: #e83e8c;">
vanillaCallPayoff = max(spot - strike, 0)</pre>

              <h6>Capped Call Payoff</h6>
              <pre class="bg-light mx-4 my-2 p-2" style="color: #e83e8c;">
cappedCallPayoff = max(min(spot, cap) - strike, 0)
                 = max(spot - strike, 0) - max(spot - cap, 0)</pre>

              <h6>Vanilla Put Payoff</h6>
              <pre class="bg-light mx-4 my-2 p-2" style="color: #e83e8c;">
vanillaPutPayoff = max(strike - spot, 0)</pre>

              <h6>Floored Put Payoff</h6>
              <pre class="bg-light mx-4 my-2 p-2" style="color: #e83e8c;">
flooredPutPayoff = max(strike - max(spot, floor), 0)
                 = max(strike - spot, 0) - max(floor - spot, 0)</pre>

              <hr />
              <br />
              
              <h5 class="mb-3">Algorithms</h5>
              <h6>Decimal Places</h6>
              <p>Four types of decimal places are involved in these calculations:</p>
              <ul>
                <li><code>optinoDecimals</code> - for Optino and Cover tokens, hardcoded to 18</li>
                <li><code>decimals0</code> for token0 (or baseToken), e.g. 18 decimals for WETH in WETH/USDx</li>
                <li><code>decimals1</code> for token1 (or quoteToken), e.g. 6 decimals for USDx in WETH/USDx</li>
                <li><code>rateDecimals</code> for the rate feed. e.g. 18 for MakerDAO's feeds</li>
              </ul>
              <br />

              <h6>Call Payoff And Collateral</h6>
              <p>Requirements:</p>
              <ul>
                <li><code>strike</code> must be > 0</li>
                <li><code>bound</code>, or <code>cap</code> must be 0 for vanilla calls or > <code>strike</code> for capped calls</li>
                <li>Collateral is in the *token0* (or *baseToken*)</li>
              </ul>
              <p>Call Payoff:</p>
              <pre class="bg-light mx-4 my-2 p-2" style="color: #e83e8c;">
callPayoff = 0
if (spot > 0 && spot > strike) {
  if (bound > strike && spot > bound) {
    callPayoff = [(bound - strike) / spot] x [tokens / (10^optinoDecimals)] x (10^decimals0)
  } else {
    callPayoff = [(spot - strike) / spot] x [tokens / (10^optinoDecimals)] x (10^decimals0)
  }
}</pre>
              <p>Call Collateral:</p>
              <pre class="bg-light mx-4 my-2 p-2" style="color: #e83e8c;">
if (bound <= strike) {
  callCollateral = [tokens / (10^optinoDecimals)] x (10^decimals0)
} else {
  callCollateral = [(bound - strike) / bound] x [tokens / (10^optinoDecimals)] x (10^decimals0)
}</pre>
            <br />

            <h6>Put Payoff And Collateral</h6>
            <p>Requirements:</p>
            <ul>
              <li><code>strike</code> must be > 0</li>
              <li><code>bound</code>, or <code>floor</code> must be 0 for vanilla puts or < <code>strike</code> for floored puts</li>
              <li>Collateral is in the *token1* (or *quoteToken*)</li>
            </ul>
            <p>Put Payoff:</p>
            <pre class="bg-light mx-4 my-2 p-2" style="color: #e83e8c;">
if (bound == 0 || (bound > 0 && spot >= bound)) {
  putPayoff = [(strike - spot) / (10^rateDecimals)] x [tokens / (10^optinoDecimals)] x (10^decimals1)
} else {
  putPayoff = [(strike - bound) / (10^rateDecimals)] x [tokens / (10^optinoDecimals)] x (10^decimals1)
}</pre>
            <p>Put Collateral:</p>
            <pre class="bg-light mx-4 my-2 p-2" style="color: #e83e8c;">
putCollateral = [(strike - bound) / (10^rateDecimals)] x [tokens / (10^optinoDecimals)] x (10^decimals1)</pre>
            </b-card-text>
          </b-tab>
          <!--
          <b-tab title="Risks">
            <b-card-text>Risks</b-card-text>
          </b-tab>
          -->
          <!--
          <b-tab title="Reference">
            <b-card-text>Reference</b-card-text>
          </b-tab>
          -->
        </b-tabs>
      </b-card>

      <!--
      <b-card no-body header="Documentation" class="border-0" header-class="p-1">
        <b-card-body class="m-1 p-1">
          <b-row>
            <b-col cols="10">
              <b-collapse id="accordion-docs" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>docs I start opened because <code>visible</code> is <code>true</code></b-card-text>
                  <b-card-text>{{ text }}</b-card-text>
                </b-card-body>
              </b-collapse>
              <b-collapse id="accordion-risks" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>risks I start opened because <code>visible</code> is <code>true</code></b-card-text>
                  <b-card-text>{{ text }}</b-card-text>
                </b-card-body>
              </b-collapse>
              <b-collapse id="accordion-reference" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>reference I start opened because <code>visible</code> is <code>true</code></b-card-text>
                  <b-card-text>{{ text }}</b-card-text>
                </b-card-body>
              </b-collapse>
            </b-col>
            <b-col cols="2">
              <b-list-group class="mt-5">
                <b-list-group-item v-b-toggle.accordion-docs>Docs Home</b-list-group-item>
                <b-list-group-item v-b-toggle.accordion-formulae>Formulae</b-list-group-item>
                <b-list-group-item v-b-toggle.accordion-risks>Risks</b-list-group-item>
                <b-list-group-item v-b-toggle.accordion-reference>Reference</b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
      -->
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
