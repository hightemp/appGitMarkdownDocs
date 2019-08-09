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
            sRepositoriesDirName: '.appGitMarkdownDocs_repositories',
            sRepositoriesDirPath: '',
            oConfiguration: null
        }
    },
    
    methods: {
        
    },
    
    created: function()
    {
        console.log('Application created');
        
        Notify.setDefaults({
            position: 'top-right',
            timeout: 100000,
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
                icon: 'report_problem'
            });
        }
        
        if (!this.oConfiguration) {
            this.oConfiguration = {};
        }
        
        this.sRepositoriesDirName = this.oConfiguration['sRepositoriesDirName'] ? this.oConfiguration['sRepositoriesDirName'] : this.sRepositoriesDirName;
        this.sRepositoriesDirPath = this.oConfiguration['sRepositoriesDirPath'] ? this.oConfiguration['sRepositoriesDirPath'] : path.join(os.homedir(), this.sRepositoriesDirName);
        
        console.log('Repositories dir path', this.sRepositoriesDirPath, fs.existsSync(this.sRepositoriesDirPath));
        
        if (!fs.existsSync(this.sRepositoriesDirPath)) {
            console.log('Repositories dir not found', this.sRepositoriesDirPath);
            try {
                fs.mkdirSync(this.sRepositoriesDirPath, { recursive: true });
            } catch(oException) {
                console.log('Repositories dir couldn\'t be created', this.sRepositoriesDirPath);
                this.$q.notify({
                    color: 'negative', 
                    message: `It is not possible to create a directory ('${this.sRepositoriesDirPath}')`, 
                    icon: 'report_problem'
                });
            } finally {
                console.log('Repositories dir created', this.sRepositoriesDirPath);
                this.$q.notify({
                    color: 'positive', 
                    message: `Created directory for repositories ('${this.sRepositoriesDirPath}')`, 
                    icon: 'check'
                });
            }
        }
    }
}
</script>

<style>
</style>
