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
                <q-btn dense @click="fnShowAddRepositoryWindow()" icon="add" />
                <q-btn dense @click="fnShowEditRepositoryWindow()" icon="create" :disable="iActiveTab == -1"/>
                <q-btn dense @click="fnPushRepository" icon="arrow_upward" :disable="iActiveTab == -1"/>
                <q-btn dense @click="fnPullRepository" icon="arrow_downward" :disable="iActiveTab == -1"/>
                <q-btn-dropdown 
                    dense
                    flat
                    icon="person" 
                >
                    <q-list>
                        <q-item 
                            v-for="(oUser, iIndex) in aUsers"
                            :active="fnGetCurrentUserID()==iIndex"
                            clickable
                            @click="fnSetUserForCurrentRepository(iIndex)"
                        >
                            <q-item-section avatar>
                                <q-avatar>
                                    <img :src="oUser.sAvatarImageURL">
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ oUser.sUserName }}</q-item-label>
                                <q-item-label caption>{{ oUser.sEmail }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable @click="fnAddNewUser">
                            <q-item-section avatar>
                                <q-icon name="add"/>
                            </q-item-section>
                            <q-item-section>
                                Add user
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
                <q-btn dense @click="fnShowSettings" icon="settings" />
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
        
        <add-repository-window
            :bShowAddRepositoryWindow="bShowAddRepositoryWindow"
            :iUserIndex="fnGetCurrentUserID()"
            :aUsers="aUsers"
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
import _ from "underscore"
import Vue, { VueConstructor } from 'vue'

export default {
    name: 'PageIndex',

    components: {
        'repository-tab-content': RepositoryTabContent,
        'add-repository-window': AddRepositoryWindow,
        'add-new-user-window': AddNewUserWindow
    },
    
    data: function()
    {
        return {            
            sNewRepositoryFieldState: '',
            sNewRepositoryInvalidFeedback: '',
            sRepositoryURL: '',
            
            bShowAddRepositoryWindow: false,
            bShowAddNewUserWindow: false,
            bShowEditRepositoryWindow: false,
            
            bShowAddRepositoryButtonSpinner: false,
            
            iUserIndex: -1,
            
            iActiveTab: -1,
            
            aUsers: [
                {
                    sLogin: 'testuser',
                    sAvatarImageURL: 'https://cdn.quasar.dev/logo/svg/quasar-logo.svg',
                    sUserName: 'Vasja Pupkin',
                    sEmail: 'test@test.com',
                    sPassword: '123456'
                },
                {
                    sLogin: 'testuser2',
                    sAvatarImageURL: 'https://cdn.quasar.dev/logo/svg/quasar-logo.svg',
                    sUserName: 'Petja Vasichkin',
                    sEmail: 'test2@test.com',
                    sPassword: '123456'
                }
            ],
            
            aRepositories: [
            /*
                {
                    sName: "test",
                    sURL: "git@github.com:hightemp/wappGitMarkdownDocs.git",
                    iUserIndex: 0,
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
            */
            ]
        };
    },
  
    methods: {
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
        
        fnValidateIsEmpty: function(sValue)
        {
            var bResult =
                (_.isString(sValue) && sValue !='')
                || (_.isNumber(sValue))
                || 'Can\'t be empty.';
            console.log('fnValidateIsEmpty', sValue, bResult);
            return bResult;
        },
        fnValidateRepositoryName: function(sValue)
        {
            console.log('fnValidateRepositoryName', sValue);
            return this.fnFindRepository({ sName: sValue }) == -1 || 'A repository with the same name already exists.';
        },
        fnValidateRepositoryURL: function(sValue)
        {
            console.log('fnValidateRepositoryURL', sValue);
            return /^https?:\/\//.test(sValue) || 'HTTP protocol must be used';
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
