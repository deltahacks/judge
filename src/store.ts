/* eslint-disable camelcase */
import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase/app';
import db from './firebaseinit';

// Use vuex with Vue
Vue.use(Vuex);

interface StoreState {
  currentHackathon: string;
}

// export the store
export default new Vuex.Store({
  // Vuex state variables appended with vuex in front
  state: {
    currentHackathon: 'DH8',
  } as StoreState,
});
