<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import os from 'os'    
import fs from 'fs'  
import path from 'path'
import process from 'process'

import { Notify } from 'quasar'

export default {
    name: 'App',
    
    data: function()
    {
        return {
            sConfigurationFileName: '.appGitMarkdownDocs.json',
            sConfigurationFilePath: '',
            oConfiguration: {}
        }
    },
    
    methods: {
        
    },
    
    created: function()
    {
        console.log('Application created');
        
        Notify.setDefaults({
            position: 'top-right',
            timeout: 2500,
            textColor: 'white',
            actions: [{ icon: 'close', color: 'white' }]
        })
        
        this.sConfigurationFilePath = path.join(os.homedir(), this.sConfigurationFileName);
        console.log('Configuration file path', this.sConfigurationFilePath);
        
        try {
            var sConfigurationFileContents = fs.readFileSync(this.sConfigurationFilePath);
        
            this.oConfiguration = JSON.parse(sConfigurationFileContents);
        } catch(oException) {
            this.$q.notify({
                color: 'negative', 
                message: `The settings file ('${this.sConfigurationFilePath}') was not found and a new one will be created. The default settings will be used.`, 
                icon: 'report_problem',
                timeout: 100000
            });
        }
    }
}
</script>

<style>
</style>
