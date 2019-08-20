
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE_CONFIGURATION({ commit, state, dispatch, getters }, { oConfiguration })
{
    console.log('SAVE_CONFIGURATION');
    fs.writeFileSync(state.sConfigurationFilePath, JSON.stringify(oConfiguration));
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

        dispatch('SAVE_CONFIGURATION', { oConfiguration: getters['CONFIGURATION'] });
    }
}
