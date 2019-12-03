
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'
import _ from 'underscore'

export function SAVE({ commit, state, dispatch, getters, rootGetters })
{
    console.log('SAVE USERS');

    var oConfigurationState = rootGetters['configuration/STATE']

    try {
        fs.writeFileSync(oConfigurationState.sUsersFilePath, JSON.stringify(state));
    } catch (oException) {
        Notify.create({
            color: 'negative', 
            message: `Can't save users file: ${oException.message}`, 
            icon: 'report_problem'
        });
    }
}

export function LOAD({ commit, state, dispatch, getters, rootGetters })
{
    console.log('LOAD USERS');

    try {
        var oConfigurationState = rootGetters['configuration/STATE']
        var sUsersFileContents = fs.readFileSync(oConfigurationState.sUsersFilePath).toString();
        var aUsers = JSON.parse(sUsersFileContents);

        if (!_.isArray(aUsers)) {
            Notify.create({
                color: 'negative', 
                message: `Wrong root element type in ${oConfigurationState.sUsersFilePath}`, 
                icon: 'report_problem'
            });

            throw new Error();
        }

        commit('SET', { aUsers });
    } catch(oException) {
        dispatch('SAVE');
    }
}

export function SET({ commit, state, dispatch, getters }, { aUsers }) 
{
    console.log('SET USERS', state, { aUsers });

    commit('SET', { aUsers });
    dispatch('SAVE');
}

export function UPDATE({ commit, state, dispatch, getters }, { iIndex, oUser }) 
{
    console.log('UPDATE USER', state, { iIndex, oUser });

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

