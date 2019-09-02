
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE_CONFIGURATION({ commit, state, dispatch, getters })
{
    console.log('SAVE_CONFIGURATION');
    if (!fs.existsSync(state.sConfigurationDirPath)) {
        if (fs.mkdirSync(state.sConfigurationDirPath)) {
            console.log(state.sConfigurationDirPath+' directory created');
        }
    }
    if (!fs.existsSync(state.oConfiguration.sRepositoriesDirPath)) {
        if (fs.mkdirSync(state.oConfiguration.sRepositoriesDirPath)) {
            console.log(state.oConfiguration.sRepositoriesDirPath+' directory created');
        }
    }
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

export function SET_USER_INDEX({ commit, state, dispatch, getters }, { iUserIndex }) 
{
    console.log('SET_USER_INDEX', state, { iUserIndex });

    commit('SET_USER_INDEX', { iUserIndex });
    dispatch('SAVE_CONFIGURATION');
}

export function SET_ACTIVE_TAB({ commit, state, dispatch, getters }, { iActiveTab }) 
{
    console.log('SET_ACTIVE_TAB', state, { iActiveTab });

    if (iActiveTab<-1 || iActiveTab>getters.REPOSITORIES_COUNT) {
        iActiveTab = -1;
        console.log('SET_ACTIVE_TAB: iActiveTab<-1 || iActiveTab>getters.REPOSITORIES_COUNT');
        console.log('SET_ACTIVE_TAB: iActiveTab = -1');
    }
    commit('SET_ACTIVE_TAB', { iActiveTab });
    dispatch('SAVE_CONFIGURATION');
}

