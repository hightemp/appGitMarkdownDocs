<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>

import fs from 'fs'  
import { Notify } from 'quasar'

export default {
    name: 'App',
    
    created: function()
    {
        console.log('Application created');
        
        window.oApplication = this;
        
        Notify.setDefaults({
            position: 'top-right',
            timeout: 100000,
            textColor: 'white',
            actions: [{ icon: 'close', color: 'white' }]
        })
        
        this.$store.dispatch('configuration/LOAD');
        
        var oConfigurationState = this.$store.getters['configuration/STATE'];
        var oConfiguration = oConfigurationState.oConfiguration;
        
        console.log('Configuration file path', oConfigurationState.sConfigurationFilePath); 
        console.log('Configuration', oConfiguration);
        console.log('Repositories dir path', oConfiguration['sRepositoriesDirPath'], fs.existsSync(oConfiguration['sRepositoriesDirPath']));
        
        this.$store.dispatch('users/LOAD');
        this.$store.dispatch('repositories/LOAD');

        var sRepositoriesDirPath = oConfiguration['sRepositoriesDirPath'];
        
        if (!fs.existsSync(sRepositoriesDirPath)) {
            console.log('Repositories dir not found', sRepositoriesDirPath);
            try {
                fs.mkdirSync(sRepositoriesDirPath, { recursive: true });
            } catch(oException) {
                console.log('Repositories dir couldn\'t be created', sRepositoriesDirPath);
                this.$q.notify({
                    color: 'negative', 
                    message: `It is not possible to create a directory ('${sRepositoriesDirPath}')`, 
                    icon: 'report_problem'
                });
            } finally {
                console.log('Repositories dir created', sRepositoriesDirPath);
                this.$q.notify({
                    color: 'positive', 
                    message: `Created directory for repositories ('${sRepositoriesDirPath}')`, 
                    icon: 'check'
                });
            }
        }
    }
}
</script>