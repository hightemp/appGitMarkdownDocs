<template>
    <div>
        <div id="indexpage-top-panel">
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
                <q-btn @click="fnShowAddWindow" icon="add" />
                <q-btn @click="fnShowEditWindow" icon="create" :disable="iActiveTab == -1"/>
                <q-btn @click="fnPush" icon="arrow_upward" />
                <q-btn @click="fnPull" icon="arrow_downward" />
                <q-btn @click="fnShowSettings" icon="settings" />
            </q-btn-group>
        </div>
        
        <div id="indexpage-tabs-panel">
            <q-tab-panels 
                v-model="iActiveTab" 
            >
                <q-tab-panel 
                    v-for="(oItem, iIndex) in aRepositories" 
                    :name="iIndex"
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

        <div 
            v-show="bShowLoadingScreen"
        >
            <div class="loading-screen row content-center justify-center">
                <q-spinner-gears
                    color="light-blue"
                    size="200px"
                    :thickness="2"
                />
            </div>
        </div>        
    </div>
</template>

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
                            "article2"
                        ],
                        "tag3": [],
                        "tag4": [],
                        "tag5": [],
                        "tag6": [],
                        "tag7": [],
                        "tag8": [],
                        "tag9": [],
                        "tag10": [],
                        "tag11": [],
                        "tag12": [],
                        "tag13": [],
                        "tag14": [],
                        "tag15": [],
                        "tag16": [],
                        "tag17": [],
                    },
                    oPinndedTags: {
                        "tag3": [],
                        "tag4": [],
                        "tag5": [],
                        "tag6": [],
                        "tag7": [],                        
                    },
                    aArticles: [
                        "article1",
                        "article2",
                        "article3",
                    ]
                },
                {
                    sName: "test2",
                },
                {
                    sName: "test3",
                },
                {
                    sName: "test4",
                },
                {
                    sName: "test5",
                },
                {
                    sName: "test6",
                },
                {
                    sName: "test7",
                }
            ]
        };
    },
  
    methods: {
        fnPush: function()
        {
            console.log('fnPush');
            this.$nextTick(function() {
                this.$refs['repository_component_'+this.iActiveTab][0].fnPushRepository();
            });            
        },
        fnPull: function()
        {
            console.log('fnPull');
            this.$nextTick(function() {
                this.$refs['repository_component_'+this.iActiveTab][0].fnPullRepository();
            });            
        },        
        fnShowAddWindow: function()
        {
            console.log('fnShowAddWindow');
        },
        fnShowEditWindow: function()
        {
            console.log('fnShowEditWindow');        
        },
        fnShowSettings: function()
        {
            console.log('fnShowSettings');        
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
            console.log('fnResetNewRepositoryModal');
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
            console.log('fnNewRepositoryFormSubmit');
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
            console.log('fnSelectTab', iIndex);
            console.log('this.iActiveTab', this.iActiveTab);
                        
            localStorage.setItem('iActiveTab', iIndex);
            this.iActiveTab = iIndex;
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
        this.fnSelectTab(localStorage.getItem('iActiveTab')*1);
        //this.fnGetRepositories();
        console.log('this.iActiveTab', this.iActiveTab);
    }
}
</script>
