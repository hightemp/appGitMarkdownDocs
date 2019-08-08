<template>
    <router-view />
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  
  methods: {
    openURL
  }
}
</script>

<style>
</style>
