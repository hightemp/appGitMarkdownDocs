<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>

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
        
        console.log('Configuration file path', this.sConfigurationFilePath);
        
        this.fnLoadConfiguration();
        
        console.log('Configuration', this.oConfiguration);
        console.log('Repositories dir path', this.oConfiguration['sRepositoriesDirPath'], fs.existsSync(this.oConfiguration['sRepositoriesDirPath']));
        
        var sRepositoriesDirPath = this.oConfiguration['sRepositoriesDirPath'];
        
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