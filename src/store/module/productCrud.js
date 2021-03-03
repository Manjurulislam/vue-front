import Axios from "axios";
import {GET_PRODUCTS_LIST, SET_PRODUCT_FORM_DATA} from "@/store/mutations";
import {productResource} from "@/store/api";

const state = {
    productList: [],
    schema: {
        id: "",
        title: "",
        description: "",
        price: "",
        image: {},
        status: 1
    }
};

const getters = {
    getProductList(state) {
        return state.productList
    },
    setSchemaData(state) {
        return state.schema;
    }
};
const mutations = {
    [GET_PRODUCTS_LIST](state, result) {
        state.productList = result;
    },

    [SET_PRODUCT_FORM_DATA](state, result) {
        state.schema = result;
    }
};

const actions = {
    fetchProductList({commit}, SearchParam) {
        return new Promise(function (resolve, reject) {
            Axios.get(productResource, {params: SearchParam})
                .then(function (response) {
                    let result = response.data.data;
                    commit("GET_PRODUCTS_LIST", result);
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                    reject();
                });
        });
    },

    saveNewItem({commit}, schema) {
        let data = schema;

        return new Promise((resolve, reject) => {
            Axios.post(productResource, data)
                .then(function (response) {
                    if (response.data.status === "success") {
                        resolve();
                    } else {
                        console.log(response.data.message);
                        reject();
                    }
                })
                .catch(function (error) {
                    //console.log(error.response);
                    reject(error.response);
                });
        });
    },

    updateItem({commit}, schema) {
        let data = schema.formData;
        const url = `${productResource}/${schema.id}`;

        return new Promise((resolve, reject) => {
            Axios.post(url, data)
                .then(function (response) {
                    console.log(response)
                    if (response.data.status === "success") {

                        resolve();
                    } else {
                        console.log(response.data.message)
                        reject();
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
                    reject(error.response);
                });
        });
    },

    deleteProduct({commit}, schema) {
        const url = `${productResource}/${schema.id}`;
        return new Promise((resolve, reject) => {
            Axios.delete(url)
                .then(function (response) {
                    if (response.data.status === "success") {
                        resolve();
                    } else {
                        console.log(response.data.message);
                        reject();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error.response);
                });
        });
    },

};

export default {
    state,
    getters,
    actions,
    mutations
};