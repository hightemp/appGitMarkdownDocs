
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE_REPOSITORIES({ commit, state, dispatch, getters, rootGetters })
{
    console.log('SAVE_REPOSITORIES', rootGetters.configuration);
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

export function LOAD_REPOSITORIES({ commit, state, dispatch, getters })
{
    console.log('LOAD_REPOSITORIES');

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

        dispatch('SAVE_REPOSITORIES');
    }
}

export function SET_REPOSITORY({ commit, state, dispatch, getters }, { iIndex, oRepository }) 
{
    console.log('SET_REPOSITORY', state, { oRepository });

    commit('SET_REPOSITORY', { iIndex, oRepository });
    dispatch('SAVE_REPOSITORIES');
}

export function ADD_REPOSITORY({ commit, state, dispatch, getters }, { oRepository }) 
{
    console.log('ADD_REPOSITORY', state, { oRepository });

    commit('ADD_REPOSITORY', { oRepository });
    dispatch('SAVE_REPOSITORIES');
}

export function DELETE_REPOSITORY({ commit, state, dispatch, getters }, { iIndex }) 
{
    console.log('DELETE_REPOSITORY', state, { iIndex });

    commit('DELETE_REPOSITORY', { iIndex });
    dispatch('SAVE_REPOSITORIES');
}

