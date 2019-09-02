
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE_USERS({ commit, state, dispatch, getters })
{
    console.log('SAVE_USERS');
    if (!fs.existsSync(state.sConfigurationDirPath)) {
        if (fs.mkdirSync(state.sConfigurationDirPath)) {
            console.log(state.sConfigurationDirPath+' directory created');
        }
    }
    fs.writeFileSync(state.sConfigurationFilePath, JSON.stringify(state.oConfiguration));
}

export function LOAD_USERS({ commit, state, dispatch, getters })
{
    console.log('LOAD_USERS');

    try {
        var sConfigurationFileContents = fs.readFileSync(state.sConfigurationFilePath).toString();
        var oConfiguration = JSON.parse(sConfigurationFileContents);

        commit('SET_USERS', { oConfiguration });
    } catch(oException) {
        Notify.create({
            color: 'negative', 
            message: `The settings file ('${state.sConfigurationFilePath}') was not found and a new one will be created. The default settings will be used.`, 
            icon: 'report_problem'
        });

        dispatch('SAVE_USERS');
    }
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

export function DELETE_USER({ commit, state, dispatch, getters }, { iUserIndex }) 
{
    console.log('DELETE_USER', state, { iUserIndex });

    commit('DELETE_USER', { iUserIndex });
    dispatch('SAVE_CONFIGURATION');
}

