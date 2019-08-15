
<template>
    <q-btn-dropdown 
        filled
        flat
        no-caps
        align="left"
        class="full-width q-mt-md"
        :icon="sIcon" 
        :disable="bDisabled"
    >
        <template slot="label">
            <div class="row col">
                <template v-if="aUsers[value]">
                    <q-avatar size="28px">
                        <img :src="aUsers[value].sAvatarImageURL">
                    </q-avatar>
                    <div class="col">
                        {{ aUsers[value].sLogin }} ({{ aUsers[value].sUserName }})
                    </div>
                </template>
                <template v-else>
                    <div class="col">
                        Select user
                    </div>
                </template>
            </div>
        </template>
        <q-list>
            <q-item 
                v-for="(oUser, iIndex) in aUsers"
                :active="value==iIndex"
                clickable
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
            <q-item clickable @click="$emit('add_new_user')">
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

export default {
    name: 'UserSelector',
    
    data: function()
    {
        return {
            sIcon: "person"
        }
    },
    
    props: {
        value: {
            type: Number,
            default: -1
        },
        aUsers: {
            type: Array,
            required: true
        },
        bDisabled: {
            type: Boolean, 
            default: false,
            required: false
        }
    },
    
    watch: {
        value: function(iNewValue, iOldValue)
        {
            console.log("UserSelector watch value", iNewValue);
            
            if (this.aUsers[this.value]) {
                this.sIcon = "";
            }        
        }
    },
    
    methods: {
        fnSelectUser: function(iIndex)
        {
            console.log("UserSelector - fnSelectUser", iIndex);
            
            this.sIcon = "";
            this.$emit('input', iIndex);
        }
    },
    
    mounted: function()
    {
        console.log("UserSelector mounted", this.value);
            
        if (this.aUsers[this.value]) {
            this.sIcon = "";
        }
    }
}    
</script>