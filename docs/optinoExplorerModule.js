const OptinoExplorer = {
  template: `
    <div class="mt-5 pt-3">
      <b-row>
        <b-col cols="12" md="9" class="m-0 p-1">
          <b-card no-body header="Optinos" class="border-0" header-class="p-1">
            <br />
            <b-card no-body class="mb-1">
              <b-card-body class="p-1">

                <div class="d-flex m-0 p-0" style="height: 37px;">
                  <div class="pr-1">
                    <b-form-input type="text" size="sm" v-model.trim="seriesSearch" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                  </div>
                  <div class="pr-1 flex-grow-1">
                  </div>
                  <div class="pt-1 pr-1">
                    <b-pagination pills size="sm" v-model="seriesCurrentPage" :total-rows="seriesDataSorted.length" :per-page="seriesPerPage" v-b-popover.hover="'Page through records'"></b-pagination>
                  </div>
                  <div class="pr-1">
                    <b-form-select size="sm" :options="seriesPageOptions" v-model="seriesPerPage" v-b-popover.hover="'Select page size'"/>
                  </div>
                  <div class="pr-1">
                    <b-button size="sm" class="m-0 p-0" href="#" @click="recalculate('new', $event); $bvModal.show('bv-modal-optino')" variant="link" v-b-popover.hover="'Mint Optino'"><b-icon-pencil-square shift-v="-2" font-scale="1.4"></b-icon-pencil-square></b-button>
                  </div>
                  <!--
                  <div class="pr-1">
                    <b-dropdown size="sm" variant="link" toggle-class="m-0 p-0" menu-class="m-0 p-0" button-class="m-0 p-0" no-caret v-b-popover.hover="'Additional Menu Items...'">
                      <template v-slot:button-content>
                        <b-icon-three-dots shift-v="-2" class="rounded-circle" font-scale="1.4"></b-icon-three-dots><span class="sr-only">Submenu</span>
                      </template>
                      <b-dropdown-item-button size="sm" @click="resetTokenList()"><span style="font-size: 90%">Reset Token List</span></b-dropdown-item-button>
                    </b-dropdown>
                  </div>
                  -->
                </div>

                <b-modal v-model="optino.show" id="bv-modal-optino" size="lg" hide-footer title-class="m-0 p-0" header-class="m-1 p-1" body-class="m-1 p-1">
                  <template v-slot:modal-title>
                    <h6>{{ seriesName(optino, '') }}</h6>
                  </template>
                  <b-card no-body bg-variant="light" class="m-1 p-1">
                    <b-card-body class="m-1 p-1">
                      <b-form-group label-cols="4" label-size="sm" label="Type">
                        <b-form-select size="sm" v-model="optino.optionType" :options="optinoTypes" @input="recalculate('optionType', $event)">
                        </b-form-select>
                      </b-form-group>
                      <!--
                      <b-form-group label-cols="4" label-size="sm" label="Type">
                        <b-form-radio-group size="sm" v-model="optino.callPut" @input="recalculate('callPut', $event)">
                          <b-form-radio value="0">Call</b-form-radio>
                          <b-form-radio value="1">Put</b-form-radio>
                        </b-form-radio-group>
                      </b-form-group>
                      <b-form-group label-cols="4" label-size="sm" label="" v-if="optino.callPut == 0">
                        <b-form-radio-group size="sm" v-model="optino.vanillaOrBounded" @input="recalculate('callPut', $event)">
                          <b-form-radio value="0">Vanilla Call</b-form-radio>
                          <b-form-radio value="1">Capped Call</b-form-radio>
                        </b-form-radio-group>
                      </b-form-group>
                      <b-form-group label-cols="4" label-size="sm" label="" v-if="optino.callPut != 0">
                        <b-form-radio-group size="sm" v-model="optino.vanillaOrBounded" @input="recalculate('callPut', $event)">
                          <b-form-radio value="0">Vanilla Put</b-form-radio>
                          <b-form-radio value="1">Floored Put</b-form-radio>
                        </b-form-radio-group>
                      </b-form-group>
                      -->
                      <b-form-group label-cols="4" label-size="sm" label="Spot">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.calculatedSpot" readonly placeholder="Click to select"></b-form-input>
                          <b-input-group-append>
                            <b-button size="sm" @click="recalculateFeed('show', $event); $bvModal.show('bv-modal-optinoFeed')" variant="primary" v-b-popover.hover="'Select spot'">{{ feedName(optino) }}</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>

                      <b-form-group label-cols="4" label-size="sm" label="Strike">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.strike" @input="recalculate('strike', $event)"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="4" label-size="sm" label="Cap" description="Cap (bound) for Capped Call. Set to 0 for Vanilla Call" v-if="optino.optionType == 'cc'">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.cap" @input="recalculate('cap', $event)"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="4" label-size="sm" label="Floor" description="Floor (bound) for Floored Put. Set to 0 for Vanilla Put" v-if="optino.optionType == 'fp'">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.floor" @input="recalculate('floor', $event)"></b-form-input>
                        </b-input-group>
                      </b-form-group>

                      <b-form-group label-cols="4" label-size="sm" label="Expiry" :description="'Selection in your local timezone. In UTC format: ' + formatUTC(expiryInMillis) + '. Time defaults to 08:00:00Z (UTC)'">
                        <b-input-group>
                          <!-- <b-form-input type="text" v-model.trim="expiry"></b-form-input> -->
                          <flat-pickr v-model="optino.expiryInMillis" :config="dateConfig" class="form-control form-control-sm w-50" @input="recalculate('expiryInMillis', $event)"></flat-pickr>
                          <template v-slot:append>
                            <b-form-select size="sm" v-model.trim="optino.expirySelection" :options="expiryOptions" @input="expirySelected($event)"></b-form-select>
                          </template>
                        </b-input-group>
                      </b-form-group>

                      <b-form-group label-cols="4" label-size="sm" label="Base token">
                        <b-input-group>
                          <!-- <b-form-select v-model="token0" :options="tokenOptions" class="mt-3"></b-form-select> -->
                          <b-form-select size="sm" v-model="optino.token0" :options="tokenOptionsSorted" @input="recalculate('token0', $event)"></b-form-select>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="4" label-size="sm" label="Quote token">
                        <b-input-group>
                          <!-- <b-form-input type="text" v-model.trim="token1"></b-form-input> -->
                          <b-form-select size="sm" v-model="optino.token1" :options="tokenOptionsSorted" @input="recalculate('token1', $event)"></b-form-select>
                        </b-input-group>
                      </b-form-group>

                      <b-form-group label-cols="4" label-size="sm" label="Tokens">
                        <b-input-group size="sm" append="OPT & COV">
                          <b-form-input size="sm" type="text" v-model.trim="optino.tokens" @input="recalculate('tokens', $event)"></b-form-input>
                        </b-input-group>
                      </b-form-group>

                      <!--
                      <b-form-group label-cols="4" label-size="sm" label="collateralToken">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.collateralToken" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      -->
                      <b-form-group label-cols="4" label-size="sm" label="Collateral to escrow">
                        <b-input-group size="sm" :append="tokenSymbol(optino.collateralToken)">
                          <b-form-input size="sm" type="text" v-model.trim="optino.collateralTokens" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <!--
                      <b-form-group label-cols="4" label-size="sm" label="collateralDecimals">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.collateralDecimals" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      -->
                      <b-form-group label-cols="4" label-size="sm" label="Fee">
                        <b-input-group size="sm" :append="tokenSymbol(optino.collateralToken)">
                          <b-form-input size="sm" type="text" v-model.trim="optino.collateralFee" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="4" label-size="sm" label="Total collateral + fee">
                        <b-input-group size="sm" :append="tokenSymbol(optino.collateralToken)">
                          <b-form-input size="sm" type="text" v-model.trim="optino.collateralTokensPlusFee" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <!--
                      <b-form-group label-cols="4" label-size="sm" label="feedDecimals0">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.feedDecimals0" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      -->
                      <b-form-group label-cols="4" label-size="sm" label="currentSpot">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.currentSpot" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="4" label-size="sm" label="currentPayoff">
                        <b-input-group size="sm" :append="tokenSymbol(optino.collateralToken)">
                          <b-form-input size="sm" type="text" v-model.trim="optino.currentPayoff" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <!--
                      <b-form-group label-cols="4" label-size="sm" label="payoffs">
                        <b-input-group>
                          <b-form-input size="sm" type="text" :value="payoffs == null ? '' : JSON.stringify(payoffs)" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      -->

                      <b-tabs small card v-model="optinoFeedMode" content-class="m-0" active-tab-class="m-0 mt-2 p-0" nav-class="m-0 p-0" nav-wrapper-class="m-0 p-0">
                        <b-tab title="Payoff Chart">
                          <apexchart type="line" :options="chartOptions" :series="optino.chartSeries"></apexchart>
                        </b-tab>
                        <b-tab title="Payoff Table">
                          <b-table style="font-size: 85%;" small striped outlined selectable sticky-header select-mode="single" responsive hover :items="optino.payoffTable" :fields="payoffTableFields" :filter="searchFeed0" :filter-included-fields="['name', 'note']" head-variant="light" show-empty>
                          </b-table>
                        </b-tab>
                        <b-tab title="Mint">
                          Mint
                        </b-tab>
                        <b-tab title="Series Info" v-if="optino.series">
                          Series Info
                        </b-tab>
                      </b-tabs>

                    </b-card-body>
                  </b-card>
                </b-modal>

                <b-modal v-model="optino.showFeed" id="bv-modal-optinoFeed" size="xl" hide-footer title-class="m-0 p-0" header-class="m-1 p-1" body-class="m-0 p-0">
                  <template v-slot:modal-title>
                    Spot - {{ feedName(optino) }}
                  </template>
                  <!-- <b-card no-body bg-variant="light" class="m-0 p-0" class="border-0"> -->
                  <b-card no-body bg-variant="light" class="m-1 p-1">
                    <b-card-body class="m-1 p-1">
                      <b-tabs small card v-model="optinoFeedMode" content-class="m-0" active-tab-class="m-0 mt-2 p-0" nav-class="m-0 p-0" nav-wrapper-class="m-0 p-0">
                        <b-tab title="Spot">
                          <b-card-text>
                            <div class="d-flex m-0 p-0" style="height: 37px;">
                              <div class="pr-1">
                                <b-form-input type="text" size="sm" v-model.trim="searchFeed0" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                              </div>
                              <div class="pr-1 flex-grow-1">
                              </div>
                              <div class="pr-1">
                               <span class="text-right" style="font-size: 90%"><b-icon-exclamation-circle variant="danger" shift-v="1" font-scale="0.9"></b-icon-exclamation-circle> Always confirm the feed contract address in a block explorer and alternative sources</span>
                              </div>
                            </div>
                            <b-table style="font-size: 85%;" small striped outlined selectable sticky-header select-mode="single" responsive hover :items="registeredFeeds" :fields="selectFeedFields" :filter="searchFeed0" :filter-included-fields="['name', 'note']" head-variant="light" show-empty @row-clicked="singleFeedSelectionRowClicked">
                              <template v-slot:cell(name)="data">
                                <span v-b-popover.hover="data.item.name">{{ truncate(data.item.name, 24) }}</span>
                              </template>
                              <template v-slot:cell(type)="data">
                                <b-form-select plain size="sm" v-model.trim="data.item.type" :options="typeOptions" disabled></b-form-select>
                              </template>
                              <template v-slot:cell(note)="data">
                                <span v-b-popover.hover="data.item.note">{{ truncate(data.item.note, 32) }}</span>
                              </template>
                              <template v-slot:cell(spot)="data">
                                <span class="text-right">{{ data.item.spot.shift(-data.item.decimals).toString() }} </span>
                              </template>
                              <template v-slot:cell(timestamp)="data">
                                <span class="text-right">{{ new Date(data.item.timestamp*1000).toLocaleString() }} </span>
                              </template>
                              <template v-slot:cell(address)="data">
                                <b-link :href="explorer + 'token/' + data.item.address" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.address + ' on the block explorer'">{{ truncate(data.item.address, 10) }}</b-link>
                              </template>
                              <template v-slot:cell(selected)="data">
                                <b-icon-check2 font-scale="1.4" v-if="data.item.address == optino.feed0"></b-icon-check2>
                              </template>
                            </b-table>
                          </b-card-text>
                        </b-tab>
                        <b-tab title="Cross">
                          <b-card-text>
                            <div class="d-flex m-0 p-0" style="height: 37px;">
                              <div class="pr-1">
                                <b-form-input type="text" size="sm" v-model.trim="searchFeed0" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                              </div>
                              <div class="pr-1 flex-grow-1">
                              </div>
                              <div class="pr-1">
                               <span class="text-right" style="font-size: 90%"><b-icon-exclamation-circle variant="danger" shift-v="1" font-scale="0.9"></b-icon-exclamation-circle> Always confirm the feed contract address in a block explorer and alternative sources</span>
                              </div>
                            </div>
                            <b-table style="font-size: 85%;" small striped striped selectable sticky-header select-mode="single" responsive hover :items="registeredFeeds" :fields="selectFeedFields" :filter="searchFeed0" :filter-included-fields="['name', 'note']" head-variant="light" show-empty>
                              <template v-slot:cell(name)="data">
                                <span v-b-popover.hover="data.item.name">{{ truncate(data.item.name, 24) }}</span>
                              </template>
                              <template v-slot:cell(type)="data">
                                <b-form-select plain size="sm" v-model.trim="data.item.type" :options="typeOptions" disabled></b-form-select>
                              </template>
                              <template v-slot:cell(note)="data">
                                <span v-b-popover.hover="data.item.note">{{ truncate(data.item.note, 32) }}</span>
                              </template>
                              <template v-slot:cell(spot)="data">
                                <span class="text-right">{{ data.item.spot.shift(-data.item.decimals).toString() }} </span>
                              </template>
                              <template v-slot:cell(timestamp)="data">
                                <span class="text-right">{{ new Date(data.item.timestamp*1000).toLocaleString() }} </span>
                              </template>
                              <template v-slot:cell(address)="data">
                                <b-link :href="explorer + 'token/' + data.item.address" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.address + ' on the block explorer'">{{ truncate(data.item.address, 10) }}</b-link>
                              </template>
                              <template v-slot:cell(selected)="data">
                                <!-- <b-icon-check2 font-scale="1.4" v-if="data.item.address == optino.feed0"></b-icon-check2> -->
                                <b-dropdown size="sm" variant="link" toggle-class="m-0 p-0" menu-class="m-0 p-0" button-class="m-0 p-0" no-caret v-b-popover.hover="'Select feeds'">
                                  <template v-slot:button-content>
                                    <b-icon-three-dots class="rounded-circle" shift-v="-2" font-scale="1.4" v-if="data.item.address != optino.feed0 && data.item.address != optino.feed1"></b-icon-three-dots><span class="sr-only">Submenu</span>
                                    <span v-if="data.item.address == optino.feed0">First Feed</span>
                                    <span v-if="data.item.address == optino.feed1">Second Feed</span>
                                  </template>
                                  <b-dropdown-item-button size="sm" @click="dualFeedFirstFeed(data.item.address)" :disabled="data.item.address == optino.feed1"><span style="font-size: 90%">Use As First Feed</span></b-dropdown-item-button>
                                  <b-dropdown-item-button size="sm" @click="dualFeedSecondFeed(data.item.address)" :disabled="data.item.address == optino.feed0"><span style="font-size: 90%">Use As Second Feed</span></b-dropdown-item-button>
                                </b-dropdown>
                              </template>
                            </b-table>
                          </b-card-text>
                        </b-tab>
                        <b-tab title="Custom">
                          <b-card-text>
                            <b-form>
                              <b-form-group label-cols="5" label-size="sm" label="First feed">
                                <b-input-group>
                                  <b-form-select size="sm" v-model="optino.feed0" :options="feedSelectionsSorted0" @input="recalculateFeed('feed0', $event)"></b-form-select>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Second feed">
                                <b-input-group>
                                  <b-form-select size="sm" v-model="optino.feed1" :options="feedSelectionsSorted1" v-on:change="recalculateFeed('feed1', $event)"></b-form-select>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="First feed type">
                                <b-input-group>
                                  <b-form-select size="sm" v-model.trim="optino.type0" :options="typeOptions" v-on:change="recalculateFeed('type0', $event)"></b-form-select>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Second feed type">
                                <b-input-group>
                                  <b-form-select size="sm" v-model.trim="optino.type1" :options="typeOptions" v-on:change="recalculateFeed('type1', $event)"></b-form-select>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="First feed decimal places">
                                <b-input-group>
                                  <b-form-select size="sm" v-model.trim="optino.decimals0" :options="decimalsOptions" v-on:change="recalculateFeed('decimals0', $event)"></b-form-select>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Second feed decimal places">
                                <b-input-group>
                                  <b-form-select size="sm" v-model.trim="optino.decimals1" :options="decimalsOptions" v-on:change="recalculateFeed('decimals1', $event)"></b-form-select>
                                </b-input-group>
                              </b-form-group>
                            </b-form>
                          </b-card-text>
                        </b-tab>
                      </b-tabs>
                      <b-form-group label-cols="5" label-size="sm" class="mt-2" :label="optino.feed1 != null && optino.feed1 != ADDRESS0 || optinoFeedMode != 0 ? 'Inverse first feed rate?' : 'Inverse feed rate?'">
                        <b-form-radio-group size="sm" v-model="optino.inverse0" @input="recalculateFeed('inverse0', $event)">
                          <b-form-radio value="0">No</b-form-radio>
                          <b-form-radio value="1">Yes</b-form-radio>
                        </b-form-radio-group>
                      </b-form-group>
                      <b-form-group label-cols="5" label-size="sm" v-if="optino.feed1 != null && optino.feed1 != ADDRESS0 || optinoFeedMode != 0" label="Inverse second feed rate?">
                        <b-form-radio-group size="sm" v-model="optino.inverse1" @input="recalculateFeed('inverse1', $event)">
                          <b-form-radio value="0">No</b-form-radio>
                          <b-form-radio value="1">Yes</b-form-radio>
                        </b-form-radio-group>
                      </b-form-group>
                      <b-form-group label-cols="5" label-size="sm" label="Reference spot rate">
                        <b-input-group>
                          <b-form-input size="sm" type="text" v-model.trim="optino.calculatedSpot" readonly placeholder="Select feed above"></b-form-input>
                          <b-input-group-append>
                            <b-button size="sm" variant="outline-primary" disabled v-b-popover.hover="'Name of reference spot rate'">{{ feedName(optino) }}</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                      <div class="d-flex justify-content-end m-0 pt-2" style="height: 37px;">
                        <div class="pr-1">
                          <b-button size="sm" @click="$bvModal.hide('bv-modal-optinoFeed')">Close</b-button>
                        </div>
                      </div>
                    </b-card-body>
                  </b-card>
                </b-modal>



                <b-table style="font-size: 85%;" small striped outlined selectable select-mode="single" responsive hover :items="seriesDataSorted" :fields="seriesDataFields" head-variant="light" :current-page="seriesCurrentPage" :per-page="seriesPerPage" :filter="seriesSearch" @filtered="seriesOnFiltered" :filter-included-fields="['base', 'quote', 'feed0', 'feed1', 'type', 'strike', 'bound', 'optino', 'cover']" show-empty>
                  <template v-slot:cell(base)="data">
                    <b-link :href="explorer + 'token/' + data.item.pair[0]" class="card-link" target="_blank" v-b-popover.hover="'View ' + tokenName(data.item.pair[0]) + ' on the block explorer'">{{ tokenSymbol(data.item.pair[0]) }}</b-link>
                  </template>
                  <template v-slot:cell(quote)="data">
                    <b-link :href="explorer + 'token/' + data.item.pair[1]" class="card-link" target="_blank" v-b-popover.hover="'View ' + tokenName(data.item.pair[1]) + ' on the block explorer'">{{ tokenSymbol(data.item.pair[1]) }}</b-link>
                  </template>
                  <template v-slot:cell(feeds)="data">
                    <b-link :href="explorer + 'address/' + data.item.feeds[0]" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.feeds[0] + ' on the block explorer'">{{ displayFeed(data.item.feeds[0]) }}</b-link>
                    <span v-if="data.item.feeds[1] != ADDRESS0">
                      x<br />
                      <b-link :href="explorer + 'address/' + data.item.feeds[1]" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.feeds[1] + ' on the block explorer'">{{ displayFeed(data.item.feeds[1]) }}</b-link>
                    </span>
                  </template>
                  <template v-slot:cell(type)="data">
                    {{ formatType(data.item.callPut, data.item.bound) }}
                  </template>
                  <template v-slot:cell(expiry)="data">
                    {{ formatUTC(data.item.expiry * 1000) }}
                  </template>
                  <template v-slot:cell(strike)="data">
                    {{ formatValue(data.item.strike, data.item.feedDecimals0) }}
                  </template>
                  <template v-slot:cell(bound)="data">
                    {{ formatValue(data.item.bound, data.item.feedDecimals0) }}
                  </template>
                  <template v-slot:cell(optino)="data">
                    <b-link :href="explorer + 'token/' + data.item.optinos[0]" class="card-link" target="_blank" v-b-popover.hover="'View ' + tokenName(data.item.optinos[0]) + ' on the block explorer'">{{ tokenSymbol(data.item.optinos[0]) }}</b-link>
                  </template>
                  <template v-slot:cell(cover)="data">
                    <b-link :href="explorer + 'token/' + data.item.optinos[1]" class="card-link" target="_blank" v-b-popover.hover="'View ' + tokenName(data.item.optinos[1]) + ' on the block explorer'">{{ tokenSymbol(data.item.optinos[1]) }}</b-link>
                  </template>
                  <template v-slot:cell(extra)="row">
                    <b-link @click="row.toggleDetails" class="card-link m-0 p-0" v-b-popover.hover="'Show ' + (row.detailsShowing ? 'less' : 'more')"><b-icon-caret-up-fill font-scale="0.9" v-if="row.detailsShowing"></b-icon-caret-up-fill><b-icon-caret-down-fill font-scale="0.9" v-if="!row.detailsShowing"></b-icon-caret-down-fill></b-link>
                    <!-- <b-button size="sm" class="m-0 p-0" href="#" @click="recalculate('show', $event); $bvModal.show('bv-modal-optino')" variant="link" v-b-popover.hover="'Mint Optino'"><b-icon-pencil-square shift-v="-2" font-scale="1.4"></b-icon-pencil-square></b-button> -->
                    <b-link @click="recalculate('setSeries', row.item); $bvModal.show('bv-modal-optino')" class="card-link m-0 p-0" v-b-popover.hover="'Edit ' + row.item.index + ' series'"><b-icon-pencil-square font-scale="0.9"></b-icon-pencil-square></b-link>
                    <!-- <b-link @click="removeTokenFromList(row.item.address, row.item.symbol)" class="card-link m-0 p-0" v-b-popover.hover="'Remove ' + row.item.symbol + ' from list. This can be added back later.'"><b-icon-trash font-scale="0.9"></b-icon-trash></b-link> -->
                  </template>
                  <template v-slot:row-details="row">
                    <b-card no-body class="m-1 mt-2 p-1">
                      <b-card-header header-tag="header" class="m-1 p-1">
                        Token {{ row.item.symbol }} {{ row.item.name }}<!-- <b-button size="sm" class="m-0 p-0" @click="removeTokenFromList(row.item.address, row.item.symbol)" variant="link" v-b-popover.hover="'Remove ' + row.item.symbol + ' from list?'"><b-icon-trash font-scale="0.9"></b-icon-trash></b-button> -->
                      </b-card-header>
                      <b-card-body class="m-0 p-0">
                      </b-card-body>
                    </b-card>
                  </template>
                </b-table>
              </b-card-body>
            </b-card>

            <b-card no-body class="mb-1">
              <!--
              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.factoryseries variant="outline-info">Series</b-button>
              </b-card-header>
              -->
              <b-collapse id="factoryseries" class="border-0">
                <b-card-body>
                  <b-form>
                    <b-row v-for="(config, index) in configData" v-bind:key="index">
                      <b-card no-body class="mb-1 w-100">
                        <b-card-header header-tag="header" class="p-1">
                          <b-button href="#" v-b-toggle="'factoryConfig-' + index" variant="outline-info">Config {{ config.index }} - {{ config.description }}</b-button>
                        </b-card-header>
                        <b-collapse :id="'factoryConfig-' + index" visible class="border-0">
                          <b-card-body>
                            <b-form-group label-cols="3" label="key">
                              <b-form-input type="text" v-model.trim="config.configKey" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label="baseToken">
                              <b-input-group>
                                <b-form-input type="text" v-model.trim="config.baseToken" readonly></b-form-input>
                                <b-input-group-append>
                                  <b-button :href="explorer + 'token/' + config.baseToken" target="_blank" variant="outline-info">🔗</b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="quoteToken">
                              <b-input-group>
                                <b-form-input type="text" v-model.trim="config.quoteToken" readonly></b-form-input>
                                <b-input-group-append>
                                  <b-button :href="explorer + 'token/' + config.quoteToken" target="_blank" variant="outline-info">🔗</b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="priceFeed">
                              <b-input-group>
                                <b-form-input type="text" v-model.trim="config.priceFeed" readonly></b-form-input>
                                <b-input-group-append>
                                  <b-button :href="explorer + 'address/' + config.priceFeed + '#code'" target="_blank" variant="outline-info">🔗</b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="maxTerm" description="2592000 = 30d * 24h * 60m * 60s">
                              <b-input-group append="seconds">
                                <b-form-input type="text" v-model.trim="config.maxTerm.toString()" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="fee">
                              <b-input-group append="%">
                                <b-form-input type="text" v-model.trim="config.fee.shift(-16).toString()" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="description">
                              <b-form-input type="text" v-model.trim="config.description" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label="timestamp" :description="new Date(config.timestamp*1000).toLocaleString()">
                              <b-form-input type="text" v-model.trim="config.timestamp.toString()" readonly></b-form-input>
                              <!-- <b-form-input type="datetime-local" v-model.trim="new Date(config.timestamp*1000).toISOString().substring(0, 22)"></b-form-input> -->
                            </b-form-group>
                          </b-card-body>
                        </b-collapse>
                      </b-card>
                    </b-row>
                  </b-form>
                </b-card-body>
              </b-collapse>

              <!--
              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.mintOptino variant="outline-info">Mint Optino</b-button>
              </b-card-header>
              -->
              <b-collapse id="mintOptino" class="border-0">
                <b-card-body>
                  <b-form>
                    <b-form-group label-cols="3" label="feed0">
                      <b-input-group>
                        <b-form-select v-model="feed0" :options="feedSelectionsSorted0" @input="recalculate('feed0', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="feed1">
                      <b-input-group>
                        <b-form-select v-model="feed1" :options="feedSelectionsSorted1" v-on:change="recalculate('feed1', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="type0">
                      <b-input-group>
                        <b-form-select v-model.trim="type0" :options="typeOptions" v-on:change="recalculate('type0', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="type1">
                      <b-input-group>
                        <b-form-select v-model.trim="type1" :options="typeOptions" v-on:change="recalculate('type1', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="decimals0">
                      <b-input-group>
                        <b-form-select v-model.trim="decimals0" :options="decimalsOptions" v-on:change="recalculate('decimals0', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="decimals1">
                      <b-input-group>
                        <b-form-select v-model.trim="decimals1" :options="decimalsOptions" v-on:change="recalculate('decimals1', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="inverse0">
                      <b-form-radio-group id="radio-group-inverse0" v-model="inverse0" @input="recalculate('inverse0', $event)">
                        <b-form-radio value="0">No</b-form-radio>
                        <b-form-radio value="1">Yes</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="inverse1">
                      <b-form-radio-group id="radio-group-inverse1" v-model="inverse1" @input="recalculate('inverse1', $event)">
                        <b-form-radio value="0">No</b-form-radio>
                        <b-form-radio value="1">Yes</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="Calculated spot">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="calculatedSpot" readonly placeholder="Retrieving latest rate"></b-form-input>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="token0">
                      <b-input-group>
                        <!-- <b-form-select v-model="token0" :options="tokenOptions" class="mt-3"></b-form-select> -->
                        <b-form-select v-model="token0" :options="tokenOptionsSorted" @input="recalculate('token0', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="token1">
                      <b-input-group>
                        <!-- <b-form-input type="text" v-model.trim="token1"></b-form-input> -->
                        <b-form-select v-model="token1" :options="tokenOptionsSorted" @input="recalculate('token1', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="callPut">
                      <b-form-radio-group id="radio-group-callput" v-model="callPut" @input="recalculate('callPut', $event)">
                        <b-form-radio value="0">Call</b-form-radio>
                        <b-form-radio value="1">Put</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="expiry" :description="'Selection in your local timezone. In UTC format: ' + formatUTC(expiryInMillis) + '. Time defaults to 08:00:00Z (UTC)'">
                      <b-input-group>
                        <!-- <b-form-input type="text" v-model.trim="expiry"></b-form-input> -->
                        <flat-pickr v-model="expiryInMillis" :config="dateConfig" class="form-control" @input="recalculate('expiryInMillis', $event)"></flat-pickr>
                        <template v-slot:append>
                          <b-form-select v-model.trim="expirySelection" :options="expiryOptions" @input="expirySelected($event)"></b-form-select>
                        </template>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="strike">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="strike" @input="recalculate('strike', $event)"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="cap" description="Cap (bound) for Capped Call. Set to 0 for Vanilla Call" v-if="callPut == 0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="cap" @input="recalculate('cap', $event)"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="floor" description="Floor (bound) for Floored Put. Set to 0 for Vanilla Put" v-if="callPut != 0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="floor" @input="recalculate('floor', $event)"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="tokens">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokens" @input="recalculate('tokens', $event)"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <div class="text-center pb-4">
                      <b-button-group>
                        <b-button @click="recalculate()" variant="primary" v-b-popover.hover="'Calc Payoff'">Recalc Payoff</b-button>
                      </b-button-group>
                      <b-button-group>
                        <b-button @click="mintOptinos()" variant="primary" v-b-popover.hover="'Mint Optinos'">Mint Optinos</b-button>
                      </b-button-group>
                    </div>
                    <b-form-group label-cols="3" label="collateralTokenNew">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="collateralTokenNew" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="collateralTokens">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="collateralTokens" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="collateralDecimalsNew">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="collateralDecimalsNew" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="collateralFee">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="collateralFee" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="feedDecimals0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feedDecimals0" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="currentSpot">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="currentSpot" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="currentPayoff">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="currentPayoff" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="payoffs">
                      <b-input-group>
                        <b-form-input type="text" :value="payoffs == null ? '' : JSON.stringify(payoffs)" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>


                    <!--
                    <b-card :title="collateralSymbol" v-if="collateralToken != null && collateralToken != ADDRESS0">
                      <b-card-text>
                      Current allowance {{ tokenData[collateralToken].allowance.shift(-collateralDecimals).toString() }}
                      </b-card-text>
                      <b-form-group label-cols="3" label="collateralAllowance">
                        <b-input-group>
                          <b-form-input type="text" v-model.trim="collateralAllowance"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <div class="text-center">
                        <b-button-group>
                          <b-button @click="setCollateralAllowance()" variant="primary" v-b-popover.hover="'Set Allowance'">Set Allowance</b-button>
                        </b-button-group>
                      </div>
                    </b-card>
                    -->

                    <br />
                    <payoff :callPut="callPut" :strike="strike" :bound="bound" :tokens="tokens" :decimals0="baseDecimals" :decimals1="quoteDecimals" :rateDecimals="rateDecimals" :symbol0="baseSymbol" :symbol1="quoteSymbol"></payoff>
                  </b-form>
                </b-card-body>
              </b-collapse>
            </b-card>
          </b-card>
        </b-col>
        <b-col cols="12" md="3" class="m-0 p-1">
          <connection></connection>
          <br />
          <optinoFactory></optinoFactory>
          <br />
          <tokens></tokens>
          <br />
          <feeds></feeds>
        </b-col>
      </b-row>
    </div>
  `,
  data: function () {
    return {
      ADDRESS0: ADDRESS0,

      reschedule: false,

      optinoFeedMode: 0,
      searchFeed0: null,


      seriesSearch: null,
      seriesCurrentPage: 1,
      seriesPerPage: 10,
      seriesPageOptions: [
        { text: "5", value: 5 },
        { text: "10", value: 10 },
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "All", value: 0 },
      ],

      optino: {
        show: false,
        showFeed: false,

        series: null,

        optionType: 'vc',

        feed0: "0x8468b2bdce073a157e560aa4d9ccf6db1db98507",
        feed1: "0x0000000000000000000000000000000000000000",
        type0: 0xff,
        type1: 0xff,
        decimals0: 0xff,
        decimals1: 0xff,
        inverse0: 0,
        inverse1: 0,
        feedDecimals0: null,
        calculatedSpot: null,

        strike: "250",
        cap: "500",
        floor: "150",

        expiryInMillis: moment().utc().add(moment().utc().hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf() < moment() ? 1 : 0, 'd').add(1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf(),
        expirySelection: "+1d",

        token0: "0x452a2652d1245132f7f47700c24e217faceb1c6c",
        token1: "0x2269fbd941938ac213719cd3487323a0c75f1667",

        tokens: "10",

        collateralToken: null,
        nonCollateralToken: null,
        collateralTokens: null,
        collateralDecimals: null,
        collateralFee: null,
        collateralTokensPlusFee: null,

        currentSpot: null,
        currentPayoff: null,

        chartSeries: [],
        spotFrom: "0",
        spotTo: "200",

        payoffTable: [],
      },

      token0: "0x452a2652d1245132f7f47700c24e217faceb1c6c",
      token1: "0x2269fbd941938ac213719cd3487323a0c75f1667",
      feed0: "0x8468b2bdce073a157e560aa4d9ccf6db1db98507",
      feed1: "0x0000000000000000000000000000000000000000",
      type0: 0xff,
      type1: 0xff,
      decimals0: 0xff,
      decimals1: 0xff,
      inverse0: 0,
      inverse1: 0,
      calculatedSpot: null,
      callPut: 0,
      expiryInMillis: moment().utc().add(moment().utc().hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf() < moment() ? 1 : 0, 'd').add(1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf(),
      strike: "200",
      cap: "300",
      floor: "100",
      spot: "250",
      tokens: "10",

      collateralTokenNew: null,
      collateralTokens: null,
      collateralDecimalsNew: null,
      collateralFee: null,

      feedDecimals0: null,
      currentSpot: null,
      currentPayoff: null,
      payoffs: null,

      expired: false,
      selectedSeries: null,
      configKey: "",
      baseToken: null,
      quoteToken: null,
      priceFeed: "",
      baseDecimals: "18",
      quoteDecimals: "18",
      rateDecimals: "18",
      maxTerm: null,
      fee: "0",
      description: "",

      optinoTypes: [
        {
          label: 'Calls',
          options: [
            { value: 'vc', text: 'Vanilla Call' },
            { value: 'cc', text: 'Capped Call' },
          ]
        },
        {
          label: 'Puts',
          options: [
            { value: 'vp', text: 'Vanilla Put' },
            { value: 'fp', text: 'Floored Put' },
          ]
        },
      ],
      expirySelection: "+1d",
      expiryOptions: [
        { value: null, text: 'Select' },
        { value: '+0d', text: '+0d' },
        { value: '+1d', text: '+1d' },
        { value: '+2d', text: '+2d' },
        { value: '+3d', text: '+3d' },
        { value: '+4d', text: '+4d' },
        { value: '+5d', text: '+5d' },
        { value: '+6d', text: '+6d' },
        { value: '+1w', text: '+1w' },
        { value: '+2w', text: '+2w' },
        { value: '+3w', text: '+3w' },
        { value: '+4w', text: '+4w' },
        { value: 'e0w', text: 'end of this week' },
        { value: 'e1w', text: 'end of next week' },
        { value: 'e2w', text: 'end of the following week' },
        { value: 'e0M', text: 'end of this month' },
        { value: 'e1M', text: 'end of next month' },
        { value: 'e2M', text: 'end of the following month' },
      ],
      collateralAllowance: "0",
      // dateConfig: {
      //   // dateFormat: 'Y-m-d H:i:S',
      //   // formatDate: (d) => new Date(d).toLocaleString(),
      //   enableTime: true,
      //   enableSeconds: true,
      //   time_24hr: true,
      //   maxDate: new Date().fp_incr(parseInt(this.maxTerm)/60/60/24),
      //   // defaultHour: 0,
      //   // defaultMinute: 0,
      //   // defaultSeconds: 0,
      // },
      seriesDataFields: [
        { key: 'index', label: 'Index', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'base', label: 'Base', sortable: true, filterByFormatted: true },
        { key: 'quote', label: 'Quote', sortable: true },
        { key: 'feeds', label: 'Feed(s)', sortable: true },
        // { key: 'feed1', label: 'Feed1', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'expiry', label: 'Expiry', sortable: true },
        { key: 'strike', label: 'Strike', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'bound', label: 'Bound', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'optino', label: 'Optino', sortable: true },
        { key: 'Cover', label: 'Cover', sortable: true },
        // { key: 'decimals', label: 'Decimals', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'totalSupply', label: 'Total Supply', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'balance', label: 'Balance', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'allowance', label: 'Allowance', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'address', label: 'Address', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'extra', label: '', sortable: false },
      ],
      selectFeedFields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'decimals', label: 'Decimals', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'note', label: 'Note', sortable: true },
        { key: 'spot', label: 'Spot', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'hasData', label: 'Data?', sortable: true },
        { key: 'timestamp', label: 'Timestamp', formatter: d => { return new Date(d*1000).toLocaleString(); }, sortable: true },
        { key: 'address', label: 'Address', sortable: true },
        { key: 'selected', label: 'Select', sortable: false },
      ],
      payoffTableFields: [
        { key: 'spot', label: 'Spot', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'payoff', label: 'Optino Payoff', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'coverPayoff', label: 'Cover Payoff', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'collateral', label: 'Collateral', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'payoffInNonCollateral', label: 'Payoff In Non-Collateral', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
      ],
    }
  },
  computed: {
    explorer () {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    // networkName() {
    //   return store.getters['connection/networkName'];
    // },
    maxTermInDays() {
      return this.maxTerm == null ? null : parseInt(this.maxTerm)/60/60/24;
    },
    dateConfig() {
      return {
        dateFormat: 'YYYY-MM-DD\\\\THH:mm:ssZ',
        enableTime: true,
        enableSeconds: true,
        time_24hr: true,
        locale: {
          firstDayOfWeek: 1
        },
        parseDate(dateString, format) {
          return moment.parse(dateString).valueOf();
          // let timezonedDate = new moment.tz(dateString, format, timeZone);
          // return new Date(
          //   timezonedDate.year(),
          //   timezonedDate.month(),
          //   timezonedDate.date(),
          //   timezonedDate.hour(),
          //   timezonedDate.minute(),
          //   timezonedDate.second()
          // );
        },
        formatDate(date, format) {
          return moment(date).format();
          // return moment(date).utc().format();
          // return moment.tz([
          //   date.getFullYear(),
          //   date.getMonth(),
          //   date.getDate(),
          //   date.getHours(),
          //   date.getMinutes(),
          //   date.getSeconds()
          // ], timeZone).locale('en-GB').format(format);
        },
        // maxDate: new Date().fp_incr(this.maxTermInDays == null ? 7 : this.maxTermInDays),
      }
    },
    bound() {
      return this.callPut == 0 ? this.cap : this.floor;
    },
    expiry() {
      return parseInt(new Date(this.expiryInMillis).getTime()/1000); // : parseInt(this.expiryInMillis / 1000);
    },
    baseSymbol() {
      return this.tokenData[this.baseToken] == null ? "ETH" : this.tokenData[this.baseToken].symbol;
    },
    quoteSymbol() {
      return this.tokenData[this.quoteToken] == null ? "DAI" : this.tokenData[this.quoteToken].symbol;
    },
    collateralToken() {
      return this.callPut == 0 ? this.baseToken : this.quoteToken;
    },
    collateralSymbol() {
      return this.callPut == 0 ? this.baseSymbol : this.quoteSymbol;
    },
    collateralDecimals() {
      return this.callPut == 0 ? this.baseDecimals : this.quoteDecimals;
    },
    collateral() {
      try {
        var callPut = this.callPut == null ? 0 : parseInt(this.callPut);
        var decimals = 18;
        var baseDecimals = this.baseDecimals == null ? 18 : parseInt(this.baseDecimals);
        var rateDecimals = this.rateDecimals == null ? 18 : parseInt(this.rateDecimals);
        var quoteDecimals = this.quoteDecimals == null ? 18 : parseInt(this.quoteDecimals);
        var strike = this.strike == null ? new BigNumber(0) : new BigNumber(this.strike).shift(rateDecimals);
        var bound = this.bound == null ? new BigNumber(0) : new BigNumber(this.bound).shift(rateDecimals);
        var baseTokens = this.baseTokens == null ? new BigNumber(1).shift(baseDecimals) : new BigNumber(this.baseTokens).shift(baseDecimals);
        logDebug("collateral", JSON.stringify(collateral));
        var collateral = collateral(callPut, strike, bound, baseTokens, decimals, baseDecimals, quoteDecimals, rateDecimals);
        logDebug("collateral", JSON.stringify(collateral));
        if (callPut == 0) {
          collateral = collateral == null ? null : collateral.shift(-baseDecimals).toString();
        } else {
          collateral = collateral == null ? null : collateral.shift(-quoteDecimals).toString();
        }
        return collateral;
      } catch (e) {
        return new BigNumber(0).toString();
      }
    },
    collateralPlusFee() {
      try {
        if (this.callPut == 0) {
          var n = new BigNumber(this.collateral).shift(this.baseDecimals);
          n = new BigNumber(n.add(n.mul(new BigNumber(this.fee).shift(16)).shift(-18)).toFixed(0));
          return n.shift(-this.baseDecimals).toString();
        } else {
          var n = new BigNumber(this.collateral).shift(this.quoteDecimals);
          n = new BigNumber(n.add(n.mul(new BigNumber(this.fee).shift(16)).shift(-18)).toFixed(0));
          return n.shift(-this.quoteDecimals).toString();
        }
      } catch (e) {
      }
      return new BigNumber(0).toString();
    },
    configData() {
      return store.getters['optinoFactory/configData'];
    },
    configOptions() {
      var configData = store.getters['optinoFactory/configData'];
      var results = [];
      results.push({ value: "", text: "(select a Config or a Series)" });
      configData.forEach(function(e) {
        results.push({ value: e.configKey, text: e.description });
      });
      return results;
    },
    seriesDataSorted() {
      var results = [];
      var seriesData = store.getters['optinoFactory/seriesData'];
      for (address in seriesData) {
        results.push(seriesData[address]);
      }
      // TODO
      // results.sort(function(a, b) {
      //   return ('' + a.symbol + a.name).localeCompare(b.symbol + a.name);
      // });
      return results;
    },
    seriesData() {
      return store.getters['optinoFactory/seriesData'];
    },
    seriesOptions() {
      var seriesData = store.getters['optinoFactory/seriesData'];
      var tokenData = store.getters['optinoFactory/tokenData'];
      var results = [];
      results.push({ value: null, text: "(none)" });
      seriesData.forEach(function(e) {
        var description = tokenData[e.optinoToken] == null ? "(loading)" : tokenData[e.optinoToken].symbol + ' - ' + tokenData[e.optinoToken].name;
        results.push({ value: e.seriesKey, text: description });
      });
      return results;
    },
    tokenData() {
      return store.getters['tokens/tokenData'];
    },
    typeOptions() {
      return store.getters['optinoFactory/typeOptions'];
    },
    decimalsOptions() {
      return store.getters['optinoFactory/decimalsOptions'];
    },
    tokenOptions() {
      var tokenData = store.getters['tokens/tokenData'];
      var results = [];
      results.push({ value: null, text: "(select Config or Series above)", disabled: true });

      Object.keys(tokenData).forEach(function(e) {
        var symbol = tokenData[e].symbol;
        var name = tokenData[e].name;
        var decimals = tokenData[e].decimals;
        if (symbol !== undefined) {
          results.push({ value: e, text: symbol + " '" + name + "' " + decimals, disabled: true });
        } else {
          results.push({ value: e, text: "Token at address " + e, disabled: true });
        }
      });
      return results;
    },
    tokenOptionsSorted() {
      var tokenData = store.getters['tokens/tokenData'];
      var sortedData = [];
      for (token in tokenData) {
        if (/^\w+$/.test(tokenData[token].symbol)) {
          sortedData.push(tokenData[token]);
        }
      }
      sortedData.sort(function(a, b) {
        return ('' + a.symbol).localeCompare(b.symbol);
      });
      var results = [];
      sortedData.forEach(function(e) {
        results.push({ value: e.address.toLowerCase(), text: e.address.substring(0, 10) + " " + e.symbol + " '" + e.name + "' " + e.decimals + " bal " + parseFloat(new BigNumber(e.balance).toFixed(8)) + " allow " + parseFloat(new BigNumber(e.allowance).toFixed(8)), disabled: false });
      });
      return results;
    },
    // feedSelectionsSorted1() {
    //   var results = [];
    //   var feedData = store.getters['feeds/feedData'];
    //   for (address in feedData) {
    //     var feed = feedData[address];
    //     console.log("feedSelectionsSorted: " + address + " => " + JSON.stringify(feed));
    //     results.push({ value: address, text: feed.name });
    //   }
    //   results.sort(function(a, b) {
    //     return ('' + a.sortKey).localeCompare(b.sortKey);
    //   });
    //   return results;
    // },
    feedSelectionsSorted0() {
      var registeredFeedData = store.getters['optinoFactory/registeredFeedData'];
      var feedData = store.getters['feeds/feedData'];
      var sortedData = [];
      for (var address in registeredFeedData) {
        var feed = registeredFeedData[address];
        if (feed.source == "registered") {
          sortedData.push(feed);
        }
      }
      for (address in feedData) {
        var feed = feedData[address];
        if (typeof registeredFeedData[address] === "undefined" && feed.source != "registered") {
          // console.log("feedSelectionsSorted0: " + address + " => " + JSON.stringify(feed));
          sortedData.push(feed);
        }
      }
      sortedData.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      var results = [];
      var t = this;
      sortedData.forEach(function(e) {
        results.push({ value: e.address, text: e.address.substring(0, 10) + " " + e.name + " " + parseFloat(new BigNumber(e.spot).shift(-e.decimals).toFixed(9)) + " " + new Date(e.timestamp*1000).toLocaleString() /*, disabled: e.address == t.feed1*/ });
      });
      return results;
    },
    feedSelectionsSorted1() {
      var registeredFeedData = store.getters['optinoFactory/registeredFeedData'];
      var feedData = store.getters['feeds/feedData'];
      var sortedData = [];
      for (var address in registeredFeedData) {
        var feed = registeredFeedData[address];
        if (feed.source == "registered") {
          sortedData.push(feed);
        }
      }
      for (address in feedData) {
        var feed = feedData[address];
        if (typeof registeredFeedData[address] === "undefined" && feed.source != "registered") {
          // console.log("feedSelectionsSorted0: " + address + " => " + JSON.stringify(feed));
          sortedData.push(feed);
        }
      }
      sortedData.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      var results = [];
      results.push({ value: "0x0000000000000000000000000000000000000000", text: "(Select optional second feed)", disabled: false });
      var t = this;
      sortedData.forEach(function(e) {
        results.push({ value: e.address, text: e.address.substring(0, 10) + " " + e.name + " " + parseFloat(new BigNumber(e.spot).shift(-e.decimals).toFixed(9)) + " " + new Date(e.timestamp*1000).toLocaleString() /*, disabled: e.address == t.feed1 */ });
      });
      return results;
    },
    registeredFeeds() {
      var results = [];
      var registeredFeedData = store.getters['optinoFactory/registeredFeedData'];
      for (var address in registeredFeedData) {
        var feed = registeredFeedData[address];
        if (feed.source == "registered") {
          results.push(feed);
        }
      }
      results.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      return results;
    },
    chartOptions() {
      return {
        chart: {
          height: 600,
          type: 'line',
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [5, 4, 10, 3]
        },
        fill: {
          type: 'solid',
          opacity: [0.85, 0.75, 0.35, 0.45],
        },
        markers: {
          size: [3, 2, 0, 1],
        },
        title: {
          text: "Payoff", // this.title,
          align: 'left',
          offsetX: 0, // 110,
        },
        xaxis: {
          type: 'numeric',
          min: parseFloat(this.optino.spotFrom),
          max: parseFloat(this.optino.spotTo),
          tickAmount: 20,
          title: {
            text: 'Spot',
          },
          labels: {
            formatter: function (value) {
              return parseFloat(parseFloat(value).toPrecision(3));
            },
            rotate: -45,
            rotateAlways: true,
          },
        },
        yaxis: [
          {
            seriesName: 'Optino Payoff',
            min: 0,
            title: {
              text: 'Payoff in ' + this.tokenSymbol(this.optino.collateralToken),
              style: {
                color: '#00cc66',
              },
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00cc66',
            },
            labels: {
              formatter: function (value) {
                return value == null ? null : parseFloat(parseFloat(value).toPrecision(3));
              },
              style: {
                colors: '#00cc66',
              }
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: 'Optino Payoff',
            min: 0,
            show: false,
            labels: {
              formatter: function (value) {
                return value == null ? null : parseFloat(parseFloat(value).toPrecision(3));
              },
              style: {
                colors: '#008FFB',
              }
            },
          },
          {
            seriesName: 'Optino Payoff',
            min: 0,
            show: false,
            labels: {
              formatter: function (value) {
                return value == null ? null : parseFloat(parseFloat(value).toPrecision(3));
              },
              style: {
                colors: '#008FFB',
              }
            },
          },
          {
            seriesName: 'Equivalent Optino Payoff in ' + this.tokenSymbol(this.optino.nonCollateralToken),
            min: 0,
            opposite: true,
            title: {
              text: 'Equivalent Payoff in ' + this.tokenSymbol(this.optino.nonCollateralToken),
              style: {
                color: '#ff00ff',
              },
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#ff00ff'
            },
            labels: {
              formatter: function (value) {
                return value == null ? null : parseFloat(parseFloat(value).toPrecision(3));
              },
              style: {
                colors: '#ff00ff',
              }
            },
          }
        ],
        tooltip: {
          x: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              return "Spot " + value;
            }
          }
        },
      };
    },
  },
  mounted() {
    // logDebug("OptinoExplorer", "mounted() Called");
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    // logDebug("OptinoExplorer", "destroyed() Called");
    this.reschedule = false;
  },
  methods: {
    singleFeedSelectionRowClicked(record, index) {
      this.optino.feed0 = record.address;
      this.optino.feed1 = ADDRESS0;
      this.optino.type0 = DEFAULTTYPE;
      this.optino.type1 = DEFAULTTYPE;
      this.optino.decimals0 = DEFAULTDECIMAL;
      this.optino.decimals1 = DEFAULTDECIMAL;
      // this.optino.inverse0
      this.optino.inverse1 = 0;
      this.recalculateFeed("singleFeedSelectionRowClicked", record)
    },
    dualFeedFirstFeed(address) {
      this.optino.feed0 = address;
      this.optino.type0 = DEFAULTTYPE;
      this.optino.type1 = DEFAULTTYPE;
      this.optino.decimals0 = DEFAULTDECIMAL;
      this.optino.decimals1 = DEFAULTDECIMAL;
      this.recalculateFeed("dualFeedFirstFeed", address)
    },
    dualFeedSecondFeed(address) {
      this.optino.feed1 = address;
      this.optino.type0 = DEFAULTTYPE;
      this.optino.type1 = DEFAULTTYPE;
      this.optino.decimals0 = DEFAULTDECIMAL;
      this.optino.decimals1 = DEFAULTDECIMAL;
      this.recalculateFeed("dualFeedSecondFeed", address)
    },
    feedName(o) {
      // var results = [];
      var registeredFeedData = store.getters['optinoFactory/registeredFeedData'];
      // var feedData = store.getters['feeds/feedData'];
      // for (var address in registeredFeedData) {
      //   var feed = registeredFeedData[address];
      //   if (feed.source == "registered") {
      //     results.push(feed);
      //   }
      // }
      // results.sort(function(a, b) {
      //   return ('' + a.sortKey).localeCompare(b.sortKey);
      // });
      // return results;
      var result = "";
      if (o.feed0 != null) {
        if (o.inverse0 != 0) {
          result = result + "Inv("
        }
        var feed0 = registeredFeedData[o.feed0];
        if (feed0 != null && o.type0 == DEFAULTTYPE && o.decimals0 == DEFAULTDECIMAL) {
          result = result + feed0.name;
        } else {
          result = result + "Custom";
        }
        if (o.inverse0 != 0) {
          result = result + ")"
        }
      }
      if (o.feed1 != null && o.feed1 != ADDRESS0) {
        result = result + "*";
        if (o.inverse1 != 0) {
          result = result + "Inv("
        }
        var feed1 = registeredFeedData[o.feed1];
        if (feed1 != null && o.type1 == DEFAULTTYPE && o.decimals1 == DEFAULTDECIMAL) {
          result = result + feed1.name;
        } else {
          result = result + "Custom";
        }
        if (o.inverse1 != 0) {
          result = result + ")"
        }
      }

      return result;
    },
    formatUTC(d) {
      return moment(d).utc().format();
    },
    formatValue(value, decimals) {
      // return parseFloat(new BigNumber(value).shift(-decimals).toFixed(decimals));
      return parseFloat(new BigNumber(value).shift(-decimals).toFixed(decimals)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9});
    },
    formatType(callPut, bound) {
      if (callPut == 0) {
        return bound == 0 ? "Vanilla Call" : "Capped Call";
      } else {
        return bound == 0 ? "Vanilla Put" : "Floored Put";
      }
    },
    seriesOnFiltered(filteredItems) {
      if (this.seriestotalRows !== filteredItems.length) {
        this.seriestotalRows = filteredItems.length;
        this.seriesCurrentPage = 1
      }
    },
    // TODO Delete
    truncate(s, l) {
      if (s.length > l) {
        return s.substr(0, l) + '...';
      }
      return s;
    },
    tokenSymbol(address) {
      var addr = address == null ? null : address.toLowerCase();
      var tokenData = store.getters['optinoFactory/tokenData'];
      if (typeof tokenData[addr] !== "undefined") {
        return tokenData[addr].symbol;
      }
      return address == null ? null : address.substr(0, 10) + '...';
    },
    tokenName(address) {
      var addr = address.toLowerCase();
      var tokenData = store.getters['optinoFactory/tokenData'];
      if (typeof tokenData[addr] !== "undefined") {
        return tokenData[addr].name;
      }
      return address;
    },
    seriesName(_optino, type) {
      if (_optino != null) {
        var name = "";
        if (_optino.optionType == 'vc') {
          name = "Vanilla Call";
        } else if (_optino.optionType == 'cc') {
          name = "Capped Call";
        } else if (_optino.optionType == 'vp') {
          name = "Vanilla Put";
        } else if (_optino.optionType == 'fp') {
          name = "Floored Put";
        }
        name += " ";

        if (_optino.token0 != null) {
          var tokenData = store.getters['optinoFactory/tokenData'];
          var token0 = tokenData[_optino.token0.toLowerCase()];
          if (typeof token0 !== "undefined") {
            name += token0.symbol;
          } else {
            name += _optino.token0.substr(0, 10);
          }
        } else {
          name += "(null)";
        }
        name += "/";
        if (_optino.token1 != null) {
          var tokenData = store.getters['optinoFactory/tokenData'];
          var token1 = tokenData[_optino.token1.toLowerCase()];
          if (typeof token1 !== "undefined") {
            name += token1.symbol;
          } else {
            name += _optino.token1.substr(0, 10);
          }
        } else {
          name += "(null)";
        }
        name += " ";
        name += moment(_optino.expiryInMillis).utc().format();
        name += " ";
        if (_optino.optionType == 'fp') {
          name += parseFloat(new BigNumber(_optino.floor).toFixed(_optino.feedDecimals0)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9});
          name += "-";
        }
        name += parseFloat(new BigNumber(_optino.strike).toFixed(_optino.feedDecimals0)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9});
        if (_optino.optionType == 'cc') {
          name += "-";
          name += parseFloat(new BigNumber(_optino.cap).toFixed(_optino.feedDecimals0)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9});
        }
        name += " ";
        name += this.feedName(_optino);
        return name;
      }
      return null;
    },
    displayFeed(address) {
      if (address == ADDRESS0) {
        return "";
      }
      var addr = address.toLowerCase();
      var feedData = store.getters['feeds/feedData'];
      if (typeof feedData[addr] !== "undefined") {
        return feedData[addr].name;
      }
      return address.substr(0, 10) + '...';
    },
    timeoutCallback() {
      var seriesData = store.getters['optinoFactory/seriesData'];
      // logDebug("OptinoExplorer", "timeoutCallback() Called - Object.keys(seriesData).length: " + Object.keys(seriesData).length);
      // Feed loaded
      if (Object.keys(seriesData).length > 0) {
        // this.reschedule = false;
        // TODO
        // this.recalculate("mounted", "mounted") // Calls the method before page loads
      }
      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 5000);
      }
    },
    configSelected(config) {
      logDebug("configSelected", "configSelected(" +JSON.stringify(config) + ")");
      if (config != null) {
        var configData = store.getters['optinoFactory/configData'];
        var t = this;
        configData.forEach(function(e) {
          if (config == e.configKey) {
            logDebug("configSelected", "Applying " +JSON.stringify(e));
            t.baseToken = e.baseToken;
            t.quoteToken = e.quoteToken;
            t.priceFeed = e.priceFeed;
            t.baseDecimals = e.baseDecimals.toString();
            t.quoteDecimals = e.quoteDecimals.toString();
            t.rateDecimals = e.rateDecimals.toString();
            t.maxTerm = e.maxTerm.toString();
            t.fee = e.fee.shift(-16).toString();
            t.description = e.description;
          }
        });
      }
      event.preventDefault();
    },
    seriesSelected(series) {
      logDebug("seriesSelected", "seriesSelected(" +JSON.stringify(series) + ")");
      if (series != null) {
        var seriesData = store.getters['optinoFactory/seriesData'];
        var configData = store.getters['optinoFactory/configData'];
        var tokenData = store.getters['optinoFactory/tokenData'];
        var t = this;
        seriesData.forEach(function(s) {
          if (series == s.seriesKey) {
            logDebug("seriesSelected", "Applying " + JSON.stringify(s));
            configData.forEach(function(c) {
              if (s.configKey == c.configKey) {
                logDebug("seriesSelected", "Applying Config " + JSON.stringify(c));
                t.baseToken = c.baseToken;
                t.quoteToken = c.quoteToken;
                t.priceFeed = c.priceFeed;
                t.baseDecimals = c.baseDecimals.toString();
                t.quoteDecimals = c.quoteDecimals.toString();
                t.rateDecimals = c.rateDecimals.toString();
                t.maxTerm = c.maxTerm.toString();
                t.fee = c.fee.shift(-16).toString();
                t.description = tokenData[s.optinoToken].name;
                t.callPut = parseInt(s.callPut);
                t.expiryInMillis = s.expiry * 1000;
                t.strike = s.strike;
                if (t.callPut == 0) {
                  t.cap = s.bound;
                } else {
                  t.floor = s.bound;
                }
              }
            });
          }
        });
      }
      event.preventDefault();
    },
    expirySelected(expiryString) {
      if (expiryString != null) {
        var match = expiryString.match(/^([\+|e])([0-9]*)([dwM])$/);
        if (match != null) {
          if (match[1] == "+") {
            var check = moment().utc().hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            this.optino.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'd').add(parseInt(match[2]), match[3]).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            logInfo("expirySelected", "expirySelected(" + expiryString + ") => " + this.optino.expiryInMillis);
          } else if (match[1] == "e" && match[3] == "w") {
            var check = moment().utc().day(DEFAULTEXPIRYUTCDAYOFWEEK).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            this.optino.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'w').add(parseInt(match[2]), match[3]).day(DEFAULTEXPIRYUTCDAYOFWEEK).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            logInfo("expirySelected", "expirySelected(" + expiryString + ") => " + this.optino.expiryInMillis);
          } else if (match[1] == "e" && match[3] == "M") {
            var check = moment().utc().add(1, 'M').date(1).add(-1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            this.optino.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'M').add(parseInt(match[2]), match[3]).add(1, 'M').date(1).add(-1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            logInfo("expirySelected", "expirySelected(" + expiryString + ") => " + this.optino.expiryInMillis);
          }
        }
      }
    },
    async recalculateFeed(source, event) {
      logInfo("optinoExplorer", "recalculateFeed(" + source + ", " + JSON.stringify(event) + ")");
      var factoryAddress = store.getters['optinoFactory/address']
      var factory = web3.eth.contract(OPTINOFACTORYABI).at(factoryAddress);
      var feedType0 = null;
      // logInfo("optinoExplorer", "recalculateFeed feedParameters:" + JSON.stringify([this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1]));
      try {
        var _calculateSpot = promisify(cb => factory.calculateSpot([this.optino.feed0, this.optino.feed1],
          [this.optino.type0, this.optino.type1, this.optino.decimals0, this.optino.decimals1, this.optino.inverse0, this.optino.inverse1], cb));
        var calculateSpot = await _calculateSpot;
        logInfo("optinoExplorer", "recalculateFeed - calculateSpot: " + JSON.stringify(calculateSpot));
        this.optino.feedDecimals0 = calculateSpot[0];
        feedType0 = calculateSpot[1];
        this.optino.calculatedSpot = calculateSpot[2].shift(-this.optino.feedDecimals0).toString();
      } catch (e) {
        this.optino.calculatedSpot = null;
      }
    },
    async recalculate(source, event) {
      logInfo("optinoExplorer", "recalculate(" + source + ", " + JSON.stringify(event) + ")");

      if (source == "new") {
        this.optino.series = null;
      }
      if (source == "setSeries") {
        this.optino.series = event;
        // logInfo("optinoExplorer", "recalculate - optino before: " + JSON.stringify(this.optino));
        if (event.callPut == 0) {
          this.optino.optionType = event.bound == 0 ? 'vc' : 'cc';
        } else {
          this.optino.optionType = event.bound == 0 ? 'vp' : 'fp';
        }
        this.optino.feed0 = event.feeds[0];
        this.optino.feed1 = event.feeds[1];

        this.optino.type0 = event.feedParameters[0];
        this.optino.type1 = event.feedParameters[1];
        this.optino.decimals0 = event.feedParameters[2];
        this.optino.decimals1 = event.feedParameters[3];
        this.optino.inverse0 = event.feedParameters[4];
        this.optino.inverse1 = event.feedParameters[5];

        this.optino.expiryInMillis = event.expiry * 1000;

        this.optino.token0 = event.pair[0];
        this.optino.token1 = event.pair[1];
        // logInfo("optinoExplorer", "recalculate - optino  after: " + JSON.stringify(this.optino));
      }

      var factoryAddress = store.getters['optinoFactory/address']
      var factory = web3.eth.contract(OPTINOFACTORYABI).at(factoryAddress);
      var feedType0 = null;
      // logInfo("optinoExplorer", "recalculate feedParameters:" + JSON.stringify([this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1]));
      try {
        var _calculateSpot = promisify(cb => factory.calculateSpot([this.optino.feed0, this.optino.feed1],
          [this.optino.type0, this.optino.type1, this.optino.decimals0, this.optino.decimals1, this.optino.inverse0, this.optino.inverse1], cb));
        var calculateSpot = await _calculateSpot;
        logInfo("optinoExplorer", "recalculate - calculateSpot: " + JSON.stringify(calculateSpot));
        this.optino.feedDecimals0 = parseInt(calculateSpot[0]);
        feedType0 = parseInt(calculateSpot[1]);
        this.optino.calculatedSpot = calculateSpot[2].shift(-this.optino.feedDecimals0).toString();
        logInfo("optinoExplorer", "recalculate - calculateSpot: " + this.optino.calculatedSpot);
      } catch (e) {
        this.optino.calculatedSpot = null;
      }

      function shiftBigNumberArray(data, decimals) {
        var results = [];
        // console.log("data: " + JSON.stringify(data));
        if (data != null) {
          data.forEach(function(d) {results.push(d.shift(decimals).toString());});
        }
        // console.log("results: " + JSON.stringify(results));
        return results;
      }

      try {
        var feedDecimals0 = this.optino.feedDecimals0;
        logInfo("optinoExplorer", "feedDecimals0: " + feedDecimals0);
        if (source == "setSeries") {
          this.optino.strike = new BigNumber(event.strike).shift(-feedDecimals0).toString();
          if (event.callPut == 0) {
            this.optino.cap = new BigNumber(event.bound).shift(-feedDecimals0).toString();
            this.optino.floor = "0";
          } else {
            this.optino.cap = "0";
            this.optino.floor = new BigNumber(event.bound).shift(-feedDecimals0).toString();
          }
        }

        var callPut = this.optino.optionType == 'vc' || this.optino.optionType == 'cc' ? 0 : 1;

        if (parseFloat(this.optino.strike) > 0) {
          // logInfo("optinoExplorer", "this.optino.calculatedSpot: " + this.optino.calculatedSpot);
          logInfo("optinoExplorer", "this.optino.strike: " + this.optino.strike);
          // logInfo("optinoExplorer", "this.optino.floor: " + this.optino.floor);
          // logInfo("optinoExplorer", "this.optino.cap: " + this.optino.cap);
          var maxRate = parseFloat(this.optino.calculateSpot) >= parseFloat(this.optino.strike) ? this.optino.calculateSpot : this.optino.strike;
          if (callPut == 0) {
            if (this.optino.optionType == 'cc') {
              maxRate = parseFloat(this.optino.cap) >= parseFloat(maxRate) ? this.optino.cap : maxRate;
            }
          } else {
            if (this.optino.optionType == 'fp') {
              maxRate = parseFloat(this.optino.floor) >= parseFloat(maxRate) ? this.optino.floor : maxRate;
            }
          }
          // logInfo("optinoExplorer", "maxRate: " + maxRate);
          var xMax = parseFloat(maxRate * (callPut == 0 ? 7 : 2)).toPrecision(2);
          logInfo("optinoExplorer", "xMax: " + xMax);
          var steps = 100; // 100
          var xStep = parseFloat(parseFloat(xMax / steps).toPrecision(1));
          logInfo("optinoExplorer", "xStep: " + xStep);
          xMax = parseFloat(xStep * steps).toPrecision(8);
          logInfo("optinoExplorer", "xMax: " + xMax);
          this.optino.spotFrom = 0;
          this.optino.spotTo = xMax;
          var spots = [];
          logInfo("optinoExplorer", "debug1");
          for (var x = new BigNumber("0"); x.lte(new BigNumber(xMax).shift(feedDecimals0)); x = x.add(new BigNumber(xStep).shift(feedDecimals0))) {
            // logInfo("optinoExplorer", "recalculate - spots.push: " + x);
            spots.push(x.toString());
            // spots.push(new BigNumber(x).shift(feedDecimals0).toString());
          }
          // logInfo("optinoExplorer", "recalculate - spots:" + JSON.stringify(spots));

          var bound = "0";
          if (this.optino.optionType == 'cc') {
            bound = this.optino.cap;
          } else if (this.optino.optionType == 'fp') {
            bound = this.optino.floor;
          }

          var OPTINODECIMALS = 18;
          var _calcPayoff = promisify(cb => factory.calcPayoffs([this.optino.token0, this.optino.token1], [this.optino.feed0, this.optino.feed1],
            [this.optino.type0, this.optino.type1, this.optino.decimals0, this.optino.decimals1, this.optino.inverse0, this.optino.inverse1],
            [callPut, parseInt(/*this.optino.expiryInMillis*/ new Date() / 1000), new BigNumber(this.optino.strike).shift(feedDecimals0), new BigNumber(bound).shift(feedDecimals0), new BigNumber(this.optino.tokens).shift(OPTINODECIMALS)], spots, cb));

          var calcPayoff = await _calcPayoff;
          // logInfo("optinoExplorer", "recalculate - calcPayoff: " + JSON.stringify(calcPayoff));
          this.optino.collateralToken = calcPayoff[0];
          this.optino.nonCollateralToken = callPut == 0 ? this.optino.token1 : this.optino.token0;
          var collateralDecimals = parseInt(calcPayoff[1][2]);
          this.optino.collateralDecimals = calcPayoff[1][2].toString();
          var collateralTokens = calcPayoff[1][0];
          this.optino.collateralTokens = new BigNumber(calcPayoff[1][0]).shift(-this.optino.collateralDecimals).toString();
          this.optino.collateralFee = new BigNumber(calcPayoff[1][1]).shift(-this.optino.collateralDecimals).toString();
          this.optino.collateralTokensPlusFee = new BigNumber(calcPayoff[1][0]).add(calcPayoff[1][1]).shift(-this.optino.collateralDecimals).toString();
          this.optino.feedDecimals0 = parseInt(calcPayoff[1][3]);
          this.optino.currentSpot = new BigNumber(calcPayoff[1][4]).shift(-this.optino.feedDecimals0).toString();
          this.optino.currentPayoff = new BigNumber(calcPayoff[1][5]).shift(-this.optino.collateralDecimals).toString();
          // logInfo("optinoExplorer", "recalculate - optino " + JSON.stringify(this.optino));

          var payoffSeries = [];
          var coverPayoffSeries = [];
          var collateralSeries = [];
          var payoffsInNonDeliveryTokenSeries = [];
          var payoffTable = [];

          var payoffs = calcPayoff[2];
          // logInfo("optinoExplorer", "recalculate - debug1");
          for (var i = 0; i < spots.length; i++) {
            // logInfo("optinoExplorer", "recalculate - debug2");
            var spot = new BigNumber(spots[i]).shift(-feedDecimals0);
            // logInfo("optinoExplorer", "recalculate - debug3");
            var payoff = payoffs[i].shift(-collateralDecimals);
            // logInfo("optinoExplorer", "recalculate - debug4");
            var coverPayoff = collateralTokens.minus(payoffs[i]).shift(-collateralDecimals);
            // logInfo("optinoExplorer", "recalculate - debug5");
            var payoffInNonDeliveryToken;
            if (callPut == 0) {
              // logInfo("optinoExplorer", "recalculate - debug6c");
              payoffInNonDeliveryToken = new BigNumber(payoff).mul(spot);
            } else {
              // logInfo("optinoExplorer", "recalculate - debug6p");
              payoffInNonDeliveryToken = spot == 0 ? null : parseFloat(payoff) / parseFloat(spot);
            }
            payoffSeries.push({ x: parseFloat(spot.toString()), y: parseFloat(payoff.toString()) });
            coverPayoffSeries.push({ x: parseFloat(spot.toString()), y: parseFloat(coverPayoff.toString()) });
            collateralSeries.push({ x: parseFloat(spot.toString()), y: parseFloat(collateralTokens.shift(-collateralDecimals).toString()) });
            payoffsInNonDeliveryTokenSeries.push({ x: parseFloat(spot.toString()), y: payoffInNonDeliveryToken == null ? null : parseFloat(payoffInNonDeliveryToken.toString()) });
            payoffTable.push({
              spot: parseFloat(spot.toString()),
              payoff: parseFloat(payoff.toString()).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9}),
              coverPayoff: parseFloat(coverPayoff.toString()).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9}),
              collateral: parseFloat(collateralTokens.shift(-collateralDecimals).toString()).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9}),
              payoffInNonCollateral: payoffInNonDeliveryToken == null ? null : parseFloat(payoffInNonDeliveryToken.toString()).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9}) });
            // logInfo("optinoExplorer", "recalculate - spot: " + spot + ", payoff: " + payoff + ", coverPayoff: " + coverPayoff + "; collateralTokens: " + collateralTokens + "; payoffInNonDeliveryToken: " + payoffInNonDeliveryToken);
          }
          this.optino.payoffTable = payoffTable;

          this.optino.chartSeries = [{
            name: 'Optino Payoff',
            type: 'line',
            data: payoffSeries,
          }, {
            name: 'Cover Payoff',
            type: 'line',
            data: coverPayoffSeries,
          }, {
            name: 'Collateral',
            type: 'line',
            data: collateralSeries,
          }, {
            name: 'Equivalent Optino Payoff in ' + this.tokenSymbol(this.optino.nonCollateralToken),
            type: 'line',
            data: payoffsInNonDeliveryTokenSeries,
          }];
          // logInfo("optinoExplorer", "this.optino.chartSeries: " + JSON.stringify(this.optino.chartSeries));

          // logInfo("optinoExplorer", "payoffSeries: " + JSON.stringify(payoffSeries));
          // logInfo("optinoExplorer", "coverPayoffSeries: " + JSON.stringify(coverPayoffSeries));
          // logInfo("optinoExplorer", "collateralSeries: " + JSON.stringify(collateralSeries));
          // logInfo("optinoExplorer", "payoffsInNonDeliveryTokenSeries: " + JSON.stringify(payoffsInNonDeliveryTokenSeries));

          // logInfo("optinoExplorer", "collateralTokenNew " + this.collateralTokenNew);
          // logInfo("optinoExplorer", "collateralTokens " + this.collateralTokens);
          // logInfo("optinoExplorer", "collateralFee " + this.collateralFee);
          // logInfo("optinoExplorer", "collateralDecimalsNew " + this.collateralDecimalsNew);
          // logInfo("optinoExplorer", "feedDecimals0 " + this.feedDecimals0);
          // logInfo("optinoExplorer", "_currentSpot " + this.currentSpot);
          // logInfo("optinoExplorer", "_currentPayoff " + this.currentPayoff);
          // logInfo("optinoExplorer", "spots " + JSON.stringify(shiftBigNumberArray(spots, -feedDecimals0)));
          // logInfo("optinoExplorer", "calcPayoffs: " + JSON.stringify(shiftBigNumberArray(this.payoffs, -this.collateralDecimalsNew)));
        }
      } catch (e) {
      }
    },
    setCollateralAllowance(event) {
      logDebug("optinoExplorer", "setCollateralAllowance()");
      this.$bvModal.msgBoxConfirm('Set collateral allowance ' + this.collateralAllowance + ' ?', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value1 => {
          if (value1) {
            var factoryAddress = store.getters['optinoFactory/address']
            var tokenContract = web3.eth.contract(ERC20ABI).at(this.collateralToken);
            logInfo("optinoExplorer", "setCollateralAllowance tokenContract.approve('" + factoryAddress + "', '" + this.collateralAllowance + "')");
            // TODO need to use baseDecimals/quoteDecimals
            var value = new BigNumber(this.collateralAllowance).shift(this.collateralDecimals).toString();
            logInfo("optinoExplorer", "  value=" + value);
            tokenContract.approve(factoryAddress, value, { from: store.getters['connection/coinbase'] }, function(error, tx) {
              if (!error) {
                logInfo("optinoExplorer", "setCollateralAllowance() tokenContract.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("optinoExplorer", "setCollateralAllowance() tokenContract.approve() error: ");
                console.table(error);
                store.dispatch('connection/setTxError', error.message);
              }
            });

            event.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    mintOptinos(event) {
      logDebug("optinoExplorer", "mintOptinos()");
      this.$bvModal.msgBoxConfirm('Mint ' + this.tokens + ' optinos?', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value1 => {
          if (value1) {
            logInfo("optinoExplorer", "mintOptinos(" + this.tokens + ")");
            var factoryAddress = store.getters['optinoFactory/address']
            var factory = web3.eth.contract(OPTINOFACTORYABI).at(factoryAddress);
            var feedData = store.getters['feeds/feedData'];
            var feed = feedData[this.feed0.toLowerCase()];
            logInfo("optinoExplorer", "this.feed0: " + this.feed0);
            logInfo("optinoExplorer", "feed: " + feed);
            logInfo("optinoExplorer", "feedData: " + JSON.stringify(feed));
            if (!feed && (this.type0 == 0xff || this.decimals0 == 0xff)) {
              alert("Feed data not available yet");
            } else {
              var feedDecimals0 = this.decimals0 != 0xff ? this.decimals0 : feed.decimals;
              logInfo("optinoExplorer", "feedDecimals0: " + feedDecimals0);
              var OPTINODECIMALS = 18;
              var data = factory.mint.getData([this.token0, this.token1], [this.feed0, this.feed1],
                [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1],
                [this.callPut, this.expiry, new BigNumber(this.strike).shift(feedDecimals0), new BigNumber(this.bound).shift(feedDecimals0), new BigNumber(this.tokens).shift(OPTINODECIMALS)], ADDRESS0);
              logInfo("optinoExplorer", "data=" + data);

              factory.mint([this.token0, this.token1], [this.feed0, this.feed1],
                [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1],
                [this.callPut, this.expiry, new BigNumber(this.strike).shift(feedDecimals0), new BigNumber(this.bound).shift(feedDecimals0), new BigNumber(this.tokens).shift(OPTINODECIMALS)], ADDRESS0, { from: store.getters['connection/coinbase'] }, function(error, tx) {
                logInfo("optinoExplorer", "mintOptinos DEBUG1");
                if (!error) {
                  logInfo("optinoExplorer", "mintOptinos() factory.mintOptino() tx: " + tx);
                  store.dispatch('connection/addTx', tx);
                } else {
                  logInfo("optinoExplorer", "mintOptinos() factory.mintOptino() error: ");
                  console.table(error);
                  store.dispatch('connection/setTxError', error.message);
                }
              });

              event.preventDefault();
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
  },
};

const optinoExplorerModule = {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
};
