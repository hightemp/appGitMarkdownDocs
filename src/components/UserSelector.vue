
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
                        {{ aUsers[value].sUserName }}
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
                    <q-item-label>{{ oUser.sUserName }}</q-item-label>
                    <q-item-label caption>{{ oUser.sEmail }}</q-item-label>
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
            type: Number
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
    
    methods: {
        fnSelectUser: function(iIndex)
        {
            console.log("UserSelector - fnSelectUser", iIndex);
            
            this.sIcon = "";
            this.value = iIndex;
        }
    },
    
    mounted: function()
    {
        console.log("UserSelector - mounted");
        
        if (this.value!=-1) {
            this.sIcon = "";
        }
    }
}    
</script>