
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE({ commit, state, dispatch, getters })
{
    console.log('SAVE USERS');
    if (!fs.existsSync(state.sConfigurationDirPath)) {
        if (fs.mkdirSync(state.sConfigurationDirPath)) {
            console.log(state.sConfigurationDirPath+' directory created');
        }
    }
    fs.writeFileSync(state.sConfigurationFilePath, JSON.stringify(state.oConfiguration));
}

export function LOAD({ commit, state, dispatch, getters })
{
    console.log('LOAD USERS');

    try {
        //var sConfigurationFileContents = fs.readFileSync(state.sConfigurationFilePath).toString();
        //var oConfiguration = JSON.parse(sConfigurationFileContents);

        //commit('SET_USERS', { oConfiguration });
    } catch(oException) {
        dispatch('SAVE');
    }
}

export function SET({ commit, state, dispatch, getters }, { iIndex, oUser }) 
{
    console.log('SET USER', state, { oUser });

    commit('SET', { iIndex, oUser });
    dispatch('SAVE');
}

export function ADD({ commit, state, dispatch, getters }, { oUser }) 
{
    console.log('ADD USER', state, { oUser });

    commit('ADD', { oUser });
    dispatch('SAVE');
}

export function DELETE({ commit, state, dispatch, getters }, { iUserIndex }) 
{
    console.log('DELETE USER', state, { iUserIndex });

    commit('DELETE', { iUserIndex });
    dispatch('SAVE');
}

