<template>
    <q-dialog 
        v-if="m_bShowAddRepositoryWindow" 
        v-model="m_bShowAddRepositoryWindow"
        @input="$emit('visibility_change', $event)"
        @before-show="fnBeforeShow"
        @show="fnShow"
    >
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Create new repository</div>
            </q-card-section>

            <q-separator />

            <q-form 
                ref="AddRepositoryWindowForm" 
                @submit="oIndexPage.fnAddRepository(oAddRepositoryWindowForm)" 
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
import { mapGetters } from 'vuex'
import { fnValidateIsNotEmpty, fnValidateRepositoryName, fnValidateRepositoryURL } from '../validation_rules'

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
        iUserIndex: {
            type: Number,
            default: -1,
            required: false
        }
    },

    computed: {
        ...mapGetters({
            aUsers: 'users/ALL'
        }),
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
                        .validate(false)
                        .then(function(bValue)
                        {
                            console.log("AddRepositoryWindowForm validate", bValue);
                            
                            if (oThis.bValid != bValue) {
                                oThis.bAddRepositoryWindowValid = bValue & oThis.oAddRepositoryWindowForm.iUserIndex>-1;
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
            this.m_bShowAddRepositoryWindow = bNewValue;
        }
    },
    
    data: function()
    {
        return {
            m_bShowAddRepositoryWindow: false,
            aNameRules: [ 
                fnValidateRepositoryName,
                fnValidateIsNotEmpty
            ],
            aURLRules: [
                fnValidateRepositoryURL,
                fnValidateIsNotEmpty
            ],
            bValid: false,
            oAddRepositoryWindowForm: {
                sName: "",
                sURL: "",
                iUserIndex: this.iUserIndex
            }
        };
    },
    
    methods: {
        fnBeforeShow: function()
        {
            this.oAddRepositoryWindowForm = {
                sName: "",
                sURL: "",
                iUserIndex: this.iUserIndex
            };
        },
        fnShow: function()
        {
            this.$refs.AddRepositoryWindowForm.reset();
        }
    }
}
    
</script>
