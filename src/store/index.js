import Vue from "vue";
import Vuex from "vuex";

import products from "./module/productCrud";
import auth from "./module/userLogin";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        products,
        auth
    }
});

export default store;