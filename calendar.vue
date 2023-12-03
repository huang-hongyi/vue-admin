<template>
  <el-calendar v-model="date" />
  <el-button type="primary" @click="changeDate">改变日期</el-button>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  let date = ref(new Date());
  const changeDate = () => {
    date.value = new Date(new Date().getTime() - (1 * 3600 * 24 * 1000));
  }
</script>