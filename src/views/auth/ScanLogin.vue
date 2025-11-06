<template>
  <div class="scan-login">
    <a-card class="scan-login__card" :loading="pageLoading">
      <template #title>
        <a-space align="center">
          <span>扫码登录管理后台</span>
          <a-tag color="blue">Dev</a-tag>
        </a-space>
      </template>

      <div class="scan-login__content">
        <div class="scan-login__qrcode">
          <a-qrcode :value="qrCodeValue" :status="qrVisualStatus" :size="220" @refresh="qrCodeRefresh" />
        </div>
        <div class="scan-login__info">
          <a-typography-title :level="4">操作指引</a-typography-title>
          <a-typography-paragraph>
            1. 打开桶装水小程序，使用“扫码”功能扫描左侧二维码。
            <br />2. 确认提示信息后在小程序中授权登录。
            <br />3. 成功后本页将自动进入管理后台。
          </a-typography-paragraph>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const qrCodeValue = ref('');
const qrVisualStatus = ref('expired'); // active、expired、loading、scanned

const pageLoading = ref(false);

const qrCodeRefresh = () => {
  qrVisualStatus.value = 'loading';
  pageLoading.value = true;
}
</script>

<style scoped>
.scan-login {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 24px;
  padding-top: 80px;
}

.scan-login__card {
  max-width: 720px;
  width: 100%;
  border-radius: 12px;
}

.scan-login__content {
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: space-between;
}

.scan-login__qrcode {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 240px;
  min-height: 240px;
}

.scan-login__info {
  flex: 1;
}


@media (max-width: 768px) {
  .scan-login__content {
    flex-direction: column;
  }

  .scan-login__qrcode {
    min-width: unset;
  }
}
</style>
