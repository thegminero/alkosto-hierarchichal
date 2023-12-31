// import algoliasearch from 'algoliasearch';
//import { Amplify, API, Auth } from 'aws-amplify';
//import instantsearch from 'instantsearch.js';
//import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import {
  algoliasearch,
  searchBox,
  configure,
  hits,
  pagination,
  refinementList,
} from 'instantsearch.js/es/widgets';
//import aa from 'search-insights';

import resultHit from '../templates/result-hit';

import OrderCart from './order-cart';
import UpdateCart from './update-cart';
import ViewProduct from './view-products';

/**
 * @class ResultsPage
 * @description Instant Search class to display content on main page.
 */
class ResultsPage {
  constructor() {
    this._registerClient();
  }

  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @returns {void}
   */
  _registerClient() {
    // Get Secrets (Api Key and AppId from Server)
    this._searchClient = algoliasearch('MWN8IH23ME', '4e648074863f9356162d9db95a19efe0');
    this._searchInstance = instantsearch({
      indexName: 'alko-test',
      searchClient: this._searchClient,
      insights: true
    });

    this._addBindEvents();
    this._registerWidgets();
    this._startSearch();
  }

  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @returns {void}
   */
  _registerWidgets() {
    const currentCategory = decodeURI(sessionStorage.getItem('AlgoliaCategory'))
    if (this._searchInstance) {
      this._searchInstance.addWidgets([
        configure({
            analyticsTags: [currentCategory, 'location', 'anonymous', 'aparato', 'autocomplete'],
            ruleContexts: [currentCategory, 'location', 'anonymous', 'aparato', 'global-search']
        }),
        searchBox({
          container: '#searchbox',
        }),
        hits({
          container: '#hits',
          templates: {
            item: resultHit,
          },
        }),
        pagination({
          container: '#pagination',
        }),
        refinementList({
          container: '#brand-facet',
          attribute: 'brand_name',
        }),
        refinementList({
          container: '#categories-facet',
          attribute: 'categories_aborescence',
        }),
      ]);
    }
  }
  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Starts instant search after widgets are registered
   * @returns {void}
   */
  _startSearch() {
    if (this._searchInstance) {
      this._searchInstance.start();
    }
  }
  _initUpdateToCart() {
    // Update Cart event DOM propertie and event listener(s)
    this.updateCart = new UpdateCart();
  }
  _initOrderCart() {
    // Order Cart event listener(s)
    this.orderCart = new OrderCart();
  }
  _initProductViewModal() {
    // View Product Modal DOM properties and event listener(s)
    this.viewProdModal = new ViewProduct();
  }
  _addBindEvents() {
    // add insights middleware for events
    // const insightsMiddleware = createInsightsMiddleware({
    //   insightsClient: aa,
    // });

    // register insights token/user
    // aa('setUserToken', 'discount-user');

    // this._searchInstance.use(insightsMiddleware);

    // wait for instasearch hits to render to attach eventListeners to
    // action items - such as add to cart and view buttons on each hit
    this._searchInstance.on('render', () => {
      this._initUpdateToCart();
      this._initProductViewModal();
    });
    // init the Order Cart Listeners btn
    this._initOrderCart();
  }
}

export default ResultsPage;