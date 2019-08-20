
<template>
    <q-btn-dropdown 
        filled
        flat
        no-caps
        :dense="bDense"
        align="left"
        :class="{ 'full-width': bFullWidth, 'q-mt-md': bFullWidth }"
        :icon="sIcon" 
        :disable="bDisabled"
    >
        <template slot="label">
            <div class="row col">
                <template v-if="m_aUsers[value]">
                    <q-avatar size="28px">
                        <img :src="m_aUsers[value].sAvatarImageURL">
                    </q-avatar>
                    <div v-if="bShowLogin" class="col">
                        {{ m_aUsers[value].sLogin }} ({{ m_aUsers[value].sUserName }})
                    </div>
                </template>
                <template v-else>
                    <div v-if="bShowLogin" class="col">
                        Select user
                    </div>
                </template>
            </div>
        </template>
        <q-list>
            <q-item 
                v-for="(oUser, iIndex) in m_aUsers"
                :key="iIndex"
                :active="value==iIndex"
                clickable
                v-close-popup
                @click="fnSelectUser(iIndex)"
            >
                <q-item-section avatar>
                    <q-avatar>
                        <img :src="oUser.sAvatarImageURL">
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ oUser.sLogin }} ({{ oUser.sUserName }})</q-item-label>
                    <q-item-label caption>{{ oUser.sEmail }}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item 
                clickable 
                v-close-popup
                @click="fnShowAddNewUserWindow()"
            >
                <q-item-section avatar>
                    <q-icon name="add"/>
                </q-item-section>
                <q-item-section>
                    Add user
                </q-item-section>
            </q-item>            
        </q-list>
    </q-btn-dropdown>
</template>

<script>
    
import Vue, { VueConstructor } from 'vue'
import { mapGetters } from 'vuex'
import _ from 'underscore'

export default {
    name: 'UserSelector',
    
    data: function()
    {
        return {
            sIcon: "person",
            m_aUsers: []
        }
    },

    computed: {
        ...mapGetters({
            aConfigurationUsers: 'configuration/USERS'
        })
    },

    props: {
        value: {
            type: Number,
            required: false,
            default: -1
        },
        bShowLogin: {
            type: Boolean, 
            default: false,
            required: false
        },
        bDense: {
            type: Boolean, 
            default: false,
            required: false
        },
        bFullWidth: {
            type: Boolean, 
            default: false,
            required: false
        },
        aUsers: {
            validator: p => _.isArray(p) || p === null,
            required: false,
            default: null
        },
        bDisabled: {
            type: Boolean, 
            default: false,
            required: false
        }
    },
    
    watch: {
        aUsers: function(aValue)
        {
            console.log('UserSelector watch aUsers');

            this.fnSetUsers(aValue);
        },
        value: function(iNewValue, iOldValue)
        {
            console.log("UserSelector watch value", iNewValue);
            
            if (this.aUsers[this.value]) {
                this.sIcon = "";
            }        
        }
    },
    
    methods: {
        fnSetUsers: function(aValue)
        {
            console.log("fnSetUsers");

            if (aValue===null) {
                this.m_aUsers = this.aConfigurationUsers;
            } else {
                this.m_aUsers = aValue;
            }
        },
        fnShowAddNewUserWindow: function() 
        {
            console.log("fnShowAddNewUserWindow");
            
            oIndexPage.bShowAddNewUserWindow = true;
        },
        fnSelectUser: function(iIndex)
        {
            console.log("UserSelector - fnSelectUser", iIndex);
            
            if (this.m_aUsers[iIndex]) {
                this.sIcon = "";
            }
            this.$emit('input', iIndex);
        }
    },
    
    mounted: function()
    {
        console.log("UserSelector mounted", this.value);

        this.fnSetUsers(this.aUsers);
            
        if (this.m_aUsers[this.value]) {
            this.sIcon = "";
        }
    }
}    
</script>