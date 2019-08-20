
<template>
    <q-dialog 
        v-if="bShowAddNewUserWindow_i" 
        v-model="bShowAddNewUserWindow_i"
        @input="$emit('visibility_change', $event)"
        @before-show="fnBeforeShow"
        @show="fnShow"
    >
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Create new user</div>
            </q-card-section>

            <q-separator />

            <q-form 
                ref="AddNewUserWindowForm" 
                @submit="oIndexPage.fnAddNewUser(oAddNewUserWindowForm)" 
            >
                <q-card-section class="q-gutter-md">
                    <q-input 
                        filled
                        v-model="oAddNewUserWindowForm.sName" 
                        label="Login" 
                        hide-bottom-space
                        :rules="aLoginRules"
                    />
                    <q-input 
                        filled
                        v-model="oAddNewUserWindowForm.sUserName" 
                        label="User name" 
                    />
                    <q-input 
                        filled
                        v-model="oAddNewUserWindowForm.sEmail" 
                        label="E-mail" 
                    />
                    <q-input 
                        filled
                        v-model="oAddNewUserWindowForm.sPassword" 
                        label="Password" 
                    />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn 
                        :disabled="!bAddNewUserWindowValid"
                        flat 
                        label="Create" 
                        color="primary" 
                        v-close-popup 
                        type="submit" 
                    />
                </q-card-actions>
            </q-form>

        </q-card>
    </q-dialog> 
</template>

<script>

import Vue, { VueConstructor } from 'vue'
import { fnValidateIsEmpty } from '../validation_rules'

export default {
    name: 'AddNewUserWindow',

    components: {
        
    },
            
    props: {
        bShowAddNewUserWindow: {
            type: Boolean, 
            default: false,
            required: false
        }
    },
    
    computed: {
        bAddNewUserWindowValid: {
            set: function(bValue)
            {
                console.log("bAddNewUserWindowValid set", bValue);
                this.bValid = bValue;
            },
            get: function()
            {
                console.log("bAddNewUserWindowValid get");
                var oThis = this;
                
                this.$nextTick(function()
                {
                    this
                        .$refs
                        .AddNewUserWindowForm
                        .validate(false)
                        .then(function(bValue)
                        {
                            console.log("AddNewUserWindowForm validate", bValue);
                            
                            if (oThis.bValid != bValue) {
                                oThis.bAddNewUserWindowValid = bValue;
                            }
                        });
                });
                
                return this.bValid;
            },
            cache: false
        }
    },    
    
    watch: {
        bShowAddNewUserWindow: function(bNewValue, bOldValue)
        {
            console.log("AddNewUserWindow watch bShowAddNewUserWindow", bNewValue);
            this.bShowAddNewUserWindow_i = bNewValue;
        }
    },
    
    data: function()
    {
        return {
            bShowAddNewUserWindow_i: false,
            aLoginRules: [
                fnValidateIsEmpty
            ],
            bValid: false,
            oAddNewUserWindowForm: {
                sLogin: '',
                sAvatarImageURL: '',
                sUserName: '',
                sEmail: '',
                sPassword: ''
            }
        };
    },
    
    methods: {
        fnBeforeShow: function()
        {
            this.oAddRepositoryWindowForm = {
                sLogin: '',
                sAvatarImageURL: '',
                sUserName: '',
                sEmail: '',
                sPassword: ''
            };
        },
        fnShow: function()
        {
            this.$refs.AddNewUserWindowForm.reset();
        }
    }    
}
</script>
