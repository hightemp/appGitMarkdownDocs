
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE({ commit, state, dispatch, getters, rootGetters })
{
    console.log('SAVE REPOSITORIES', rootGetters.configuration);
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

export function LOAD({ commit, state, dispatch, getters })
{
    console.log('LOAD REPOSITORIES');

    try {
        //var sConfigurationFileContents = fs.readFileSync(state.sConfigurationFilePath).toString();
        //var oConfiguration = JSON.parse(sConfigurationFileContents);

        //commit('SET_CONFIGURATION', { oConfiguration });
    } catch(oException) {
        dispatch('SAVE');
    }
}

export function SET({ commit, state, dispatch, getters }, { iIndex, oRepository }) 
{
    console.log('SET REPOSITORY', state, { oRepository });

    commit('SET', { iIndex, oRepository });
    dispatch('SAVE');
}

export function ADD({ commit, state, dispatch, getters }, { oRepository }) 
{
    console.log('ADD REPOSITORY', state, { oRepository });

    commit('ADD', { oRepository });
    dispatch('SAVE');
}

export function DELETE_REPOSITORY({ commit, state, dispatch, getters }, { iIndex }) 
{
    console.log('DELETE REPOSITORY', state, { iIndex });

    commit('DELETE', { iIndex });
    dispatch('SAVE');
}

