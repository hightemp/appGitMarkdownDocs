
<template>
    <div>
    </div>
</template>

<script>
    
import Vue, { VueConstructor } from 'vue'

export default {
    name: 'RepositoryTabContent',
    
    props: {
        iIndex: {
            type: Number
        },
        oRepository: {
            type: Object,
            required: true
        },
        bActive: {
            type: Boolean,        
            required: true
        }
    },
    
    created: function()
    {
        console.log('repositories tab created');
    }
};

</script>
