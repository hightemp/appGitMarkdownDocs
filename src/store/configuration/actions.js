
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'
import { Notify } from 'quasar'

export function SAVE_CONFIGURATION({ commit, state }, { oConfiguration })
{
    fs.writeFileSync(this.sConfigurationFilePath, JSON.stringify(oConfiguration));
}

export function LOAD_CONFIGURATION({ commit, state, dispatch, getters }, {})
{
    //var bCreateFile = false;
    
    try {
        var sConfigurationFileContents = fs.readFileSync(this.sConfigurationFilePath);
        var oConfiguration = JSON.parse(sConfigurationFileContents);
        
        commit('SET_CONFIGURATION', oConfiguration);
    } catch(oException) {
        this.$q.notify({
            color: 'negative', 
            message: `The settings file ('${this.sConfigurationFilePath}') was not found and a new one will be created. The default settings will be used.`, 
            icon: 'report_problem'
        });

        dispatch('SAVE_CONFIGURATION', { oConfiguration: getters.CONFIGURATION });
        
        //bCreateFile = true;
    }

    /*
    if (!this.oConfiguration) {
        this.oConfiguration = {};
        bCreateFile = true;
    }

    this.oConfiguration = Object.assign(this.oDefaultConfiguration, this.oConfiguration);
    

    if (bCreateFile) {
        this.fnSaveConfiguration();
    }
    */
}
