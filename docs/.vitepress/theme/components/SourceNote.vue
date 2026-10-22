<script setup>
defineProps({ path: String });
const base = 'https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/';
</script>
<template>
  <aside class="source-note"><span class="source-dot"></span><span>적용 기준 <code>engine 1.x</code> · 2026.10.22</span><a v-if="path" :href="base + path" target="_blank" rel="noreferrer">원본 문서 ↗</a></aside>
</template>
