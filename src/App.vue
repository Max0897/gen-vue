<template>
  <div class="app">
    <a-config-provider :locale="zhCN">
      <router-view />
    </a-config-provider>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();

onMounted(() => {
  if (userStore.isAuthenticated && !userStore.profile) {
    userStore.fetchProfile().catch((err) => {
      console.warn('fetch profile failed', err);
    });
  }
});
</script>
<style lang="scss" scoped></style>
