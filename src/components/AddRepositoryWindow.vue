<template>
    <q-dialog 
        v-if="bShowAddRepositoryWindow_i" 
        v-model="bShowAddRepositoryWindow_i"
        @input="$emit('visibility_change', $event)"
        @show="fnShow"
    >
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Create new repository</div>
            </q-card-section>

            <q-separator />

            <q-form 
                ref="AddRepositoryWindowForm" 
                @submit="$emit('submit', oAddRepositoryWindowForm)" 
            >
                <q-card-section>
                    <q-input 
                        filled
                        v-model="oAddRepositoryWindowForm.sName" 
                        label="Name" 
                        :rules="aNameRules"
                    />
                    <q-input 
                        filled
                        v-model="oAddRepositoryWindowForm.sURL" 
                        label="Git repository URL" 
                        placeholder="https://github.com/hightemp/appGitMarkdownDocs.git"
                        :rules="aURLRules"
                    />

                    <user-selector 
                        v-model="oAddRepositoryWindowForm.iUserIndex"
                        :aUsers="aUsers"
                    />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn 
                        :disabled="!bAddRepositoryWindowValid"
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
import UserSelector from '../components/UserSelector.vue'

export default {
    name: 'AddRepositoryWindow',

    components: {
        'user-selector': UserSelector
    },
            
    props: {
        bShowAddRepositoryWindow: {
            type: Boolean, 
            default: false,
            required: false
        },
        aUsers: {
            type: Array,
            required: true
        }
    },

    computed: {
        bAddRepositoryWindowValid: {
            set: function(bValue)
            {
                console.log("bAddRepositoryWindowValid set", bValue);
                this.bValid = bValue & this.oAddRepositoryWindowForm.iUserIndex>-1;
            },
            get: function()
            {
                console.log("bAddRepositoryWindowValid get");
                var oThis = this;
                
                this.$nextTick(function()
                {
                    this
                        .$refs
                        .AddRepositoryWindowForm
                        .validate()
                        .then(function(bValue)
                        {
                            console.log("AddRepositoryWindowForm validate", bValue);
                            
                            if (oThis.bValid != bValue) {
                                oThis.bAddRepositoryWindowValid = bValue & this.oAddRepositoryWindowForm.iUserIndex>-1;
                            }
                        });                    
                });
                
                return this.bValid;
            },
            cache: false
        }
    },
    
    watch: {
        bShowAddRepositoryWindow: function(bNewValue, bOldValue)
        {
            console.log("AddRepositoryWindow watch bShowAddRepositoryWindow", bNewValue);
            this.bShowAddRepositoryWindow_i = bNewValue;
        }
    },
    
    data: function()
    {
        return {
            bShowAddRepositoryWindow_i: false,
            aNameRules: [ 
                window.oIndexPage.fnValidateRepositoryName,
                window.oIndexPage.fnValidateIsEmpty
            ],
            aURLRules: [ 
                window.oIndexPage.fnValidateRepositoryURL,
                window.oIndexPage.fnValidateIsEmpty
            ],
            bValid: false,
            oAddRepositoryWindowForm: {
                sName: "",
                sURL: "",
                iUserIndex: 0
            }
        };
    },
    
    methods: {
        fnShow: function()
        {
            this
                .$refs
                .AddRepositoryWindowForm
                .reset();
        }
    }    
}
    
</script>
