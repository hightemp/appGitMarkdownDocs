
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE({ commit, state, dispatch, getters })
{
    console.log('SAVE CONFIGURATION');

    try {
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
    } catch (oException) {
        Notify.create({
            color: 'negative', 
            message: `Can't save configuration file: ${oException.message}`, 
            icon: 'report_problem'
        });
    }
}

export function LOAD({ commit, state, dispatch, getters })
{
    console.log('LOAD CONFIGURATION');

    try {
        var sConfigurationFileContents = fs.readFileSync(state.sConfigurationFilePath).toString();
        var oConfiguration = JSON.parse(sConfigurationFileContents);

        commit('SET', { oConfiguration });
    } catch(oException) {
        Notify.create({
            color: 'warning', 
            message: `The configuration file ('${state.sConfigurationFilePath}') was not found and a new one will be created. The default settings will be used.`, 
            icon: 'report_problem'
        });

        dispatch('SAVE');
    }
}

export function SET({ commit, state, dispatch, getters }, { oConfiguration }) 
{
    console.log('SET CONFIGURATION', state, { oConfiguration });

    commit('SET', { oConfiguration });
    dispatch('SAVE');
}

export function SET_USER_INDEX({ commit, state, dispatch, getters }, { iUserIndex }) 
{
    console.log('SET_USER_INDEX', state, { iUserIndex });

    commit('SET_USER_INDEX', { iUserIndex });
    dispatch('SAVE');
}

export function SET_ACTIVE_TAB({ commit, state, dispatch, getters, rootGetters }, { iActiveTab }) 
{
    console.log('SET_ACTIVE_TAB', state, { iActiveTab });

    if (iActiveTab<-1 || iActiveTab>rootGetters['repositories/COUNT']) {
        iActiveTab = -1;
        console.log("SET_ACTIVE_TAB: iActiveTab<-1 || iActiveTab>rootGetters['repositories/COUNT']");
        console.log('SET_ACTIVE_TAB: iActiveTab = -1');
    }
    commit('SET_ACTIVE_TAB', { iActiveTab });
    dispatch('SAVE');
}

