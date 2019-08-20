
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE_CONFIGURATION({ commit, state, dispatch, getters })
{
    console.log('SAVE_CONFIGURATION');
    fs.writeFileSync(state.sConfigurationFilePath, JSON.stringify(state.oConfiguration));
}

export function LOAD_CONFIGURATION({ commit, state, dispatch, getters })
{
    console.log('LOAD_CONFIGURATION');

    try {
        var sConfigurationFileContents = fs.readFileSync(state.sConfigurationFilePath).toString();
        var oConfiguration = JSON.parse(sConfigurationFileContents);

        commit('SET_CONFIGURATION', { oConfiguration });
    } catch(oException) {
        Notify.create({
            color: 'negative', 
            message: `The settings file ('${state.sConfigurationFilePath}') was not found and a new one will be created. The default settings will be used.`, 
            icon: 'report_problem'
        });

        dispatch('SAVE_CONFIGURATION');
    }
}

export function SET_CONFIGURATION({ commit, state, dispatch, getters }, { oConfiguration }) 
{
    console.log('SET_CONFIGURATION', state, { oConfiguration });

    commit('SET_CONFIGURATION', { oConfiguration });
    dispatch('SAVE_CONFIGURATION');
}

export function SET_REPOSITORY({ commit, state, dispatch, getters }, { iIndex, oRepository }) 
{
    console.log('SET_REPOSITORY', state, { oRepository });

    commit('SET_REPOSITORY', { iIndex, oRepository });
    dispatch('SAVE_CONFIGURATION');
}

export function ADD_REPOSITORY({ commit, state, dispatch, getters }, { oRepository }) 
{
    console.log('ADD_REPOSITORY', state, { oRepository });

    commit('ADD_REPOSITORY', { oRepository });
    dispatch('SAVE_CONFIGURATION');
}

export function SET_USER({ commit, state, dispatch, getters }, { iIndex, oUser }) 
{
    console.log('SET_USER', state, { oUser });

    commit('SET_USER', { iIndex, oUser });
    dispatch('SAVE_CONFIGURATION');
}

export function ADD_USER({ commit, state, dispatch, getters }, { oUser }) 
{
    console.log('ADD_USER', state, { oUser });

    commit('ADD_USER', { oUser });
    dispatch('SAVE_CONFIGURATION');
}

export function SET_USER_INDEX({ commit, state, dispatch, getters }, { iUserIndex }) 
{
    console.log('SET_USER_INDEX', state, { iUserIndex });

    commit('SET_USER_INDEX', { iUserIndex });
    dispatch('SAVE_CONFIGURATION');
}

export function SET_ACTIVE_TAB({ commit, state, dispatch, getters }, { iActiveTab }) 
{
    console.log('SET_ACTIVE_TAB', state, { iActiveTab });

    commit('SET_ACTIVE_TAB', { iActiveTab });
    dispatch('SAVE_CONFIGURATION');
}

