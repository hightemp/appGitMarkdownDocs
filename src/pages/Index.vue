<template>
    <div>
        <div id="indexpage-top-panel" class="q-electron-drag">
            <q-tabs
                @input="fnSelectTab"
                align="left"
                dense
                narrow-indicator
                inline-label
                v-model="iActiveTab"
            >
                <q-tab 
                    v-for="(oItem, iIndex) in aRepositories" 
                    :key="iIndex"
                    :name="iIndex"
                >
                    <template slot="default">
                        <div
                            class="tab-title"
                        >
                            {{ oItem.sName }}
                        </div>
                        <q-icon
                            name="clear"
                            class="tab-close-button"
                            @click="fnCloseTab(iIndex)"
                        ></q-icon>
                    </template>
                </q-tab>
            </q-tabs>
            <q-btn-group flat>
                <q-btn dense @click="fnShowAddRepositoryWindow()" icon="add" />
                <q-btn dense @click="fnShowEditRepositoryWindow()" icon="create" :disable="iActiveTab == -1"/>
                <q-btn dense @click="fnPushRepository" icon="arrow_upward" :disable="iActiveTab == -1"/>
                <q-btn dense @click="fnPullRepository" icon="arrow_downward" :disable="iActiveTab == -1"/>
                <user-selector 
                    v-model="iUserIndex"
                    bDense
                />
                <q-btn dense @click="fnShowSettings" icon="settings" />

                <q-separator vertical />

                <q-btn v-if="$q.platform.is.desktop" dense @click="fnMinimizeWindow" icon="expand_more" />
                <q-btn v-if="$q.platform.is.desktop" dense @click="fnMaximizeWindow" :icon="m_bWindowIsMaximized ? 'unfold_more' : 'expand_less'" />
                <q-btn v-if="$q.platform.is.desktop" dense @click="fnCloseWindow" icon="close" />
            </q-btn-group>
        </div>
        
        <div id="indexpage-tabs-panel">
            <q-tab-panels 
                v-model="iActiveTab" 
            >
                <q-tab-panel 
                    v-for="(oItem, iIndex) in aRepositories" 
                    :name="iIndex"
                    :key="iIndex"
                >
                    <repository-tab-content
                        :ref="'repository_component_'+iIndex"
                        :oRepository="oItem"
                        :iIndex="iIndex"
                        :bActive="iActiveTab == iIndex"
                    >
                    </repository-tab-content>
                </q-tab-panel>
            </q-tab-panels>
        </div>
        
        <add-repository-window
            :bShowAddRepositoryWindow="bShowAddRepositoryWindow"
            :iUserIndex="fnGetCurrentUserID()"
            @visibility_change="bShowAddRepositoryWindow = $event"
        />
        
        <add-new-user-window
            :bShowAddNewUserWindow="bShowAddNewUserWindow"
            @visibility_change="bShowAddNewUserWindow = $event"
        />
    </div>
</template>

<script>
    
import RepositoryTabContent from '../components/RepositoryTabContent.vue'
import AddRepositoryWindow from '../components/AddRepositoryWindow.vue'
import AddNewUserWindow from '../components/AddNewUserWindow.vue'
import UserSelector from '../components/UserSelector.vue'
import _ from "underscore"
import Vue, { VueConstructor } from 'vue'
import { mapGetters } from 'vuex'
//import AvatarMe from '../lib/avatar'

export default {
    name: 'PageIndex',

    components: {
        'repository-tab-content': RepositoryTabContent,
        'add-repository-window': AddRepositoryWindow,
        'add-new-user-window': AddNewUserWindow,
        'user-selector': UserSelector
    },
    
    data: function()
    {
        return {
            bShowAddRepositoryWindow: false,
            bShowAddNewUserWindow: false,
            bShowEditRepositoryWindow: false,

            m_bWindowIsMaximized: false,

            bShowAddRepositoryButtonSpinner: false            
        };
    },

    computed: {
        bWindowIsMaximized: {
            set(bValue) { 
                if (process.env.MODE === 'electron') {
                    //this.m_bWindowIsMaximized = bValue

                    if (bValue) {
                        oBrowserWindow.maximize()
                    } else {
                        oBrowserWindow.unmaximize()
                    }
                }
            },
            get() { 
                if (process.env.MODE === 'electron') {
                    console.log('bWindowIsMaximized - get', oBrowserWindow.isMaximized())

                    return oBrowserWindow.isMaximized()
                }
            },
            cache: false
        },
        iUserIndex: {
            set(iUserIndex) { this.$store.dispatch('configuration/SET_USER_INDEX', { iUserIndex }) },
            get() { return this.$store.getters['configuration/USER_INDEX'] },
            cache: false
        },
        iActiveTab: {
            set(iActiveTab) { this.$store.dispatch('configuration/SET_ACTIVE_TAB', { iActiveTab }) },
            get() { return this.$store.getters['configuration/ACTIVE_TAB'] },
            cache: false
        },

        ...mapGetters({
            aRepositories: 'configuration/REPOSITORIES'
        })
    },
  
    methods: {

        fnMinimizeWindow() {
            if (process.env.MODE === 'electron') {
                this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
            }
        },

        fnMaximizeWindow() {
            this.bWindowIsMaximized = !this.bWindowIsMaximized
        },

        fnCloseWindow() {
            if (process.env.MODE === 'electron') {
                this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
            }
        },
         
        fnPushRepository: function()
        {
            console.log('fnPushRepository');
            this.$nextTick(function() {
                this.$refs['repository_component_'+this.iActiveTab][0].fnPushRepository();
            });            
        },
        fnPullRepository: function()
        {
            console.log('fnPullRepository');
            this.$nextTick(function() {
                this.$refs['repository_component_'+this.iActiveTab][0].fnPullRepository();
            });            
        },
        
        fnGetCurrentUserID: function()
        {
            console.log('fnGetCurrentUserID');
            if (this.aRepositories[this.iActiveTab]) {
                return this.aRepositories[this.iActiveTab].iUserIndex;
            }
            
            return this.iUserIndex;
        },
        
        fnSetUserForCurrentRepository: function(iUserIndex)
        {
            console.log('fnSetUserForCurrentRepository', iUserIndex);
            this.iUserIndex = iUserIndex;
            if (this.aRepositories[this.iActiveTab]) {
                Vue.set(this.aRepositories[this.iActiveTab], 'iUserIndex', iUserIndex);
            }
        },
        
        fnFindRepository: function(oParameters = {})
        {
            console.log('fnFindRepository', oParameters);
            fnFindRepository_cycle:
            for (var iIndex in this.aRepositories) {
                for (var sParameterName in oParameters) {
                    if (this.aRepositories[iIndex][sParameterName]!=oParameters[sParameterName]) {
                        continue fnFindRepository_cycle;
                    }
                }
                return iIndex;
            }
            return -1;
        },
                
        fnShowAddRepositoryWindow: function()
        {
            console.log('fnShowAddRepositoryWindow');

            this.bShowAddRepositoryWindow = true;
        },
        fnShowEditRepositoryWindow: function()
        {
            console.log('fnShowEditRepositoryWindow');        
            
            this.bShowEditRepositoryWindow = true;
        },
        fnShowSettings: function()
        {
            console.log('fnShowSettings');        
        },
        
        fnAddNewUser: function(oAddNewUserWindowForm)
        {
            console.log('fnAddNewUser', oAddNewUserWindowForm);
            
            this.$store.dispatch('ADD_USER', oAddNewUserWindowForm);

            /*
            AvatarMe.fetchAvatar(oAddNewUserWindowForm.sEmail, oAddNewUserWindowForm.sLogin, (err, avatar) => {
                if (err) console.log(err)
                console.log(avatar)
            });
            */
        },
        
        fnCloseTab: function(iIndex)
        {
            console.log('fnCloseTab', arguments);
            /*
            this
                .$http
                .post(
                    '',
                    {
                        action: 'remove_repository',
                        repository: this.aRepositories[iIndex].sName
                    }
                ).then(function(oResponse)
                {
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    this.aRepositories.splice(iIndex, 1);
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                });
            */
        },
        fnGetRepositories: function()
        {
            console.log('fnGetRepositories');
            /*
            this.bShowLoadingScreen = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'get_repositories'
                    }
                ).then(function(oResponse)
                {
                    this.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    this.aRepositories = oResponse.body.data;
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    this.bShowLoadingScreen = false;
                });
            */
        },
        fnAddRepository: function(oAddRepositoryWindowForm)
        {
            console.log('fnAddRepository', oAddRepositoryWindowForm);
            /*
            this.bShowAddRepositoryButtonSpinner = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'add_repository',
                        url: this.sRepositoryURL
                    }
                ).then(function(oResponse)
                {
                    this.bShowAddRepositoryButtonSpinner = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }

                    //git@github.com:hightemp/docLinux.git
                    
                    this.aRepositories.push(oResponse.body.data);
                    
                    this.sRepositoryURL = '';                     
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    this.bShowAddRepositoryButtonSpinner = false;
                });
            */
        },
        fnResetNewRepositoryWindow: function()
        {
            console.log('fnResetNewRepositoryModal');
            /*
            this.sNewRepositoryFieldState = '';
            this.sNewRepositoryInvalidFeedback = '';
            this.sRepositoryURL = '';
            
            var oThis = this;
            
            setTimeout(function() {
                oThis.$refs.repository_url.$el.focus();
            }, 300);
            */
        },
        fnCheckNewRepositoryForm: function()
        {
            console.log('fnCheckNewRepositoryForm');
            /*
            var bValid = this.$refs.add_new_repository_modal_form.checkValidity();
            
            for (var iIndex in this.aRepositories) {
                if (this.aRepositories[iIndex].sURL==this.sRepositoryURL) {
                    this.sNewRepositoryInvalidFeedback = "Repository already exists";
                    this.sNewRepositoryFieldState = 'invalid';
                    return false;
                }
            }

            this.sNewRepositoryInvalidFeedback = "Repository URL is required";
            
            this.sNewRepositoryFieldState = bValid ? 'valid' : 'invalid';
            
            return bValid;
            */
        },
        fnNewRepositoryFormSubmit: function(oEvent)
        {
            console.log('fnNewRepositoryFormSubmit');
            /*
            oEvent.preventDefault();
            
            if (!this.fnCheckNewRepositoryForm()) {
                return;
            }

            this.$nextTick(function() {
                this.$refs.add_new_repository_modal.hide();
            });
            
            this.fnAddRepository();
            */
        },
        fnSelectTab: function(iIndex)
        {
            console.log('fnSelectTab', iIndex);
            console.log('this.iActiveTab', this.iActiveTab);
                        
            localStorage.setItem('iActiveTab', iIndex);
            this.iActiveTab = iIndex;
        }
    },
    
    created: function()
    {
        console.log('PageIndex created');
        window.oIndexPage = this;
        window.oBrowserWindow = this.$q.electron.remote.BrowserWindow.getAllWindows()[0];

        oBrowserWindow.on('maximize', function() { oIndexPage.m_bWindowIsMaximized = true; });
        oBrowserWindow.on('unmaximize', function() { oIndexPage.m_bWindowIsMaximized = false; });            
    },
    
    mounted: function()
    {
        console.log('PageIndex mounted');
        this.fnSelectTab(localStorage.getItem('iActiveTab')*1);
        //this.fnGetRepositories();
        console.log('this.iActiveTab', this.iActiveTab);
    }
}
</script>
