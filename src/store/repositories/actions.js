
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'
import _ from 'underscore'

export function SAVE({ commit, state, dispatch, getters, rootGetters })
{
    console.log('SAVE REPOSITORIES');

    var oConfigurationState = rootGetters['configuration/STATE']

    try {
        fs.writeFileSync(oConfigurationState.sRepositoriesFilePath, JSON.stringify(state));
    } catch(oException) {
        Notify.create({
            color: 'negative', 
            message: `Can't save repositories file: ${oException.message}`, 
            icon: 'report_problem'
        });
    }
}

export function LOAD({ commit, state, dispatch, getters, rootGetters })
{
    console.log('LOAD REPOSITORIES');

    try {
        var oConfigurationState = rootGetters['configuration/STATE']
        var sRepositoriesFileContents = fs.readFileSync(oConfigurationState.sRepositoriesFilePath).toString();
        var aRepositories = JSON.parse(sRepositoriesFileContents);

        if (!_.isArray(aRepositories)) {
            Notify.create({
                color: 'negative', 
                message: `Wrong root element type in ${oConfigurationState.sRepositoriesFilePath}`, 
                icon: 'report_problem'
            });

            throw new Error();
        }

        commit('SET', { aRepositories });
    } catch(oException) {
        dispatch('SAVE');
    }
}

export function SET({ commit, state, dispatch, getters }, { aRepositories }) 
{
    console.log('SET REPOSITORY', state, { aRepositories });

    commit('SET', { aRepositories });
    dispatch('SAVE');
}

export function UPDATE({ commit, state, dispatch, getters }, { iIndex, oRepository }) 
{
    console.log('UPDATE REPOSITORY', state, { iIndex, oRepository });

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

