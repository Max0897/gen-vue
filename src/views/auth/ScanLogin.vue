<template>
  <div class="scan-login">
    <a-card class="scan-login__card" :loading="pageLoading">
      <template #title>
        <a-space align="center">
          <span>扫码登录管理后台</span>
          <a-tag color="blue">Beta</a-tag>
        </a-space>
      </template>

      <div class="scan-login__content">
        <div class="scan-login__qrcode">
          <a-qrcode
            v-if="qrCodeValue"
            :value="qrCodeValue"
            :status="qrVisualStatus"
            :size="220"
          />
          <a-empty v-else description="点击下方按钮重新获取二维码" />
        </div>

        <div class="scan-login__info">
          <a-typography-title :level="4">操作指引</a-typography-title>
          <a-typography-paragraph>
            1. 打开桶装水小程序，使用“扫码”功能扫描左侧二维码。
            <br />2. 确认提示信息后在小程序中授权登录。
            <br />3. 成功后本页将自动进入管理后台。
          </a-typography-paragraph>

          <a-space direction="vertical" size="small">
            <a-tag v-if="countdown > 0" color="processing">二维码将在 {{ countdown }} 秒后过期</a-tag>
            <a-tag v-else color="default">二维码已过期，请重新获取</a-tag>

            <a-alert
              v-if="status === 'scanned' && scannedUser"
              type="info"
              show-icon
              message="已扫码"
              :description="`扫码人：${scannedUser.nickname || scannedUser.phone_number || '管理员'}`"
            />

            <a-alert
              v-if="status === 'confirmed'"
              type="success"
              show-icon
              message="登录成功，正在跳转……"
            />

            <a-alert
              v-if="status === 'canceled'"
              type="warning"
              show-icon
              message="登录已取消，请重新扫码"
            />
          </a-space>

          <a-space class="scan-login__actions">
            <a-button type="primary" @click="handleRegenerate" :loading="pageLoading">
              重新获取二维码
            </a-button>
          </a-space>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

import { adminLoginApi } from '@/api';
import { useUserStore } from '@/stores/modules/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const qrState = reactive({
  sceneId: '',
  pollingToken: ''
});
const qrCodeValue = ref('');
const countdown = ref(0);
const status = ref('pending');
const scannedUser = ref(null);
const pageLoading = ref(false);

let countdownTimer = null;
let pollingTimer = null;

const qrVisualStatus = computed(() => {
  if (!qrCodeValue.value) {
    return 'loading';
  }
  if (status.value === 'expired' || status.value === 'canceled') {
    return 'expired';
  }
  return 'active';
});

const clearTimers = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
};

const startCountdown = () => {
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdown.value = Math.max(0, countdown.value - 1);
    if (countdown.value === 0) {
      clearTimers();
      status.value = 'expired';
    }
  }, 1000);
};

const handlePollStatus = async () => {
  if (!qrState.sceneId || !qrState.pollingToken) return;
  try {
    const res = await adminLoginApi.getLoginStatus(qrState.sceneId, qrState.pollingToken);
    status.value = res.status;
    countdown.value = res.expires_in ?? countdown.value;
    if (res.scanned_user) {
      scannedUser.value = res.scanned_user;
    }

    if (res.status === 'confirmed') {
      clearTimers();
      userStore.setTokens({
        token: res.token,
        refreshToken: res.refresh_token,
        tokenExpiresAt: res.token_expires_at,
        refreshTokenExpiresAt: res.refresh_token_expires_at,
      });
      try {
        await userStore.fetchProfile();
      } catch (error) {
        console.warn('fetch profile failed', error);
      }
      message.success('登录成功，正在跳转');
      const redirectTarget = typeof route.query?.redirect === 'string' && route.query.redirect
        ? route.query.redirect
        : '/';
      setTimeout(() => {
        router.push(redirectTarget);
      }, 400);
    } else if (res.status === 'expired') {
      clearTimers();
    }
  } catch (error) {
    clearTimers();
    status.value = 'expired';
  }
};

const startPolling = () => {
  clearInterval(pollingTimer);
  pollingTimer = setInterval(handlePollStatus, 2500);
};

const initQRCode = async () => {
  pageLoading.value = true;
  clearTimers();
  scannedUser.value = null;
  status.value = 'pending';
  try {
    const res = await adminLoginApi.createLoginQRCode();
    qrState.sceneId = res.scene_id;
    qrState.pollingToken = res.polling_token;
    qrCodeValue.value = res.qr_content;
    console.log('qrCodeValue.value', qrCodeValue.value);
    countdown.value = res.expires_in ?? 0;
    startCountdown();
    startPolling();
  } catch (error) {
    message.error(error?.message || '生成二维码失败');
  } finally {
    pageLoading.value = false;
  }
};

const handleRegenerate = () => {
  initQRCode();
};

onMounted(() => {
  initQRCode();
});

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<style scoped>
.scan-login {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 80px;
}

.scan-login__card {
  max-width: 720px;
  width: 100%;
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

.scan-login__actions {
  margin-top: 16px;
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
