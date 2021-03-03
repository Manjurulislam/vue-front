import Axios from "axios";
import {SET_AUTH_USER, SET_USER_TOKEN} from "@/store/mutations";
import {authApi,logoutApi} from "@/store/api";

const state = {
    authUser: {},
    loggedIn: false,
    userToken: {}
};

const getters = {
    getAuthUser(state) {
        return state.authUser
    },
    getUserToken(state) {
        return state.userToken;
    }
};
const mutations = {
    [SET_AUTH_USER](state, result) {
        state.authUser = result;
    },
    [SET_USER_TOKEN](state, result) {
        state.userToken = result;
    }
};

const actions = {

    authenticateUser({commit, schema}, authUser) {

        return new Promise((resolve, reject) => {
            Axios.post(authApi, authUser)
                .then(function (response) {
                    const result = response.data.data;
                    let token = response.data.access_token;
                    let user = response.data.user;
                    commit('SET_AUTH_USER', user)
                    commit('SET_USER_TOKEN', token)
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user));
                    //console.log(response.data);

                    ////console.log(resolve())
                    resolve(response);
                })
                .catch(function (error) {
                    //console.log(error.response)
                    reject(error.response);
                });
        });
    },

    logoutUser({commit, state}) {
        return new Promise((resolve, reject) => {
            Axios.post(logoutApi)
                .then(function (response) {
                    if (response.data.status === "success") {
                        localStorage.removeItem('token')
                        localStorage.removeItem('user');
                    }
                    resolve();
                })
                .catch(function (error) {
                    console.log(error.response)
                    reject();
                });
        });
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};