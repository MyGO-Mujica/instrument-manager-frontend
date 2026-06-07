<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <a-layout style="min-height: 100vh; background: #f0f2f5;">
    <a-layout-content style="display: flex; align-items: center; justify-content: center;">
      <RouterView />
    </a-layout-content>
  </a-layout>
</template>
