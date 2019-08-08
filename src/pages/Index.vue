<template>
    <div>
        <div id="indexpage-top-panel">
            <q-tabs
                @select="fnSelectTab"
            >
                <q-tab 
                    v-for="(oItem, iIndex) in aRepositories" 
                    :name="oItem.sName"
                    :active="sActiveTabName == oItem.sName"
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
            <q-btn-group outline>
                <q-btn outline icon="add" />
                <q-btn outline icon="create" :disable="sActiveTabName == ''"/>
                <q-btn outline icon="settings" />
            </q-btn-group>
        </div>
        
        <q-separator />

        <q-tab-panels 
            v-model="sActiveTabName" 
            animated
        >
            <q-tab-panel 
                v-for="(oItem, iIndex) in aRepositories" 
                :name="oItem.sName"
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                <repository-tab-content
                    :oRepository="oItem"
                    :iIndex="iIndex"
                    :bActive="sActiveTabName == oItem.sName"
                >
                </repository-tab-content>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<style>
</style>

<script>
    
import { openURL } from 'quasar'
import RepositoryTabContent from '../components/RepositoryTabContent.vue'
import Vue, { VueConstructor } from 'vue'
import OS from 'os'

export default {
    name: 'PageIndex',

    components: {
        'repository-tab-content' : RepositoryTabContent
    },

    data: function()
    {
        return {
            sActiveTabName: '',
            
            sNewRepositoryFieldState: '',
            sNewRepositoryInvalidFeedback: '',
            sRepositoryURL: '',
            
            bShowAddRepositoryButtonSpinner: false,
            
            bShowLoadingScreen: false,
            
            iActiveTab: -1,
            aRepositories: [
            
                {
                    sName: "test",
                    sURL: "git@github.com:hightemp/wappGitMarkdownDocs.git",
                    sUser: '',
                    sPath: '',
                    oTags: {
                        "tag1": [
                            "article1"
                        ],
                        "tag2": [
                            "articles2"
                        ]
                    },
                    aArticles: [
                        "article1",
                        "articles2"
                    ]
                }
            
            ]
        };
    },
  
    methods: {
        fnCloseTab: function(iIndex)
        {
            console.log('fnCloseTab');
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
        },
        fnGetRepositories: function()
        {
            console.log('fnGetRepositories');
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
        },
        fnAddRepository: function()
        {
            console.log('fnAddRepository');
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
        },
        fnResetNewRepositoryModal: function()
        {
            this.sNewRepositoryFieldState = '';
            this.sNewRepositoryInvalidFeedback = '';
            this.sRepositoryURL = '';
            
            var oThis = this;
            
            setTimeout(function() {
                oThis.$refs.repository_url.$el.focus();
            }, 300);
        },
        fnCheckNewRepositoryForm: function()
        {
            console.log('fnCheckNewRepositoryForm');
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
        },
        fnNewRepositoryFormSubmit: function(oEvent)
        {
            oEvent.preventDefault();
            
            if (!this.fnCheckNewRepositoryForm()) {
                return;
            }

            this.$nextTick(function() {
                this.$refs.add_new_repository_modal.hide();
            });
            
            this.fnAddRepository();
        },
        fnSelectTab: function(iIndex)
        {
            this.iActiveTab = iIndex;
            localStorage.setItem('iActiveTab', iIndex);
        }
    },
    
    created: function()
    {
        console.log('PageIndex created');
        window.oApplication = this;
    },
    
    mounted: function()
    {
        console.log('PageIndex mounted');
        this.iActiveTab = localStorage.getItem('iActiveTab');
        //this.fnGetRepositories();
    }
}
</script>
