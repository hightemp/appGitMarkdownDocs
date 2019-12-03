import Vue from 'vue'
import Vuex from 'vuex'

import configuration from './configuration'
import users from './users'
import repositories from './repositories'

Vue.use(Vuex)
console.log('VUEX LOADED');

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
    const Store = new Vuex.Store({
        modules: {
            configuration,
            users,
            repositories
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV
    })

    return Store
}
