import { defineStore } from 'pinia';
import { authApi, userApi } from '@/api';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRES_KEY = 'token_expires_at';
const REFRESH_EXPIRES_KEY = 'refresh_token_expires_at';

const readStorage = (key) => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(key) || '';
};

const writeStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  if (!value) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.setItem(key, value);
  }
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: readStorage(TOKEN_KEY),
    refreshToken: readStorage(REFRESH_TOKEN_KEY),
    tokenExpiresAt: readStorage(TOKEN_EXPIRES_KEY),
    refreshTokenExpiresAt: readStorage(REFRESH_EXPIRES_KEY),
    profile: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    setTokens(payload = {}) {
      const {
        token = '',
        refreshToken = '',
        tokenExpiresAt = '',
        refreshTokenExpiresAt = '',
      } = payload;

      this.token = token;
      this.refreshToken = refreshToken;
      this.tokenExpiresAt = tokenExpiresAt;
      this.refreshTokenExpiresAt = refreshTokenExpiresAt;

      writeStorage(TOKEN_KEY, token);
      writeStorage(REFRESH_TOKEN_KEY, refreshToken);
      writeStorage(TOKEN_EXPIRES_KEY, tokenExpiresAt);
      writeStorage(REFRESH_EXPIRES_KEY, refreshTokenExpiresAt);
    },
    clearTokens() {
      this.setTokens({
        token: '',
        refreshToken: '',
        tokenExpiresAt: '',
        refreshTokenExpiresAt: '',
      });
      this.profile = null;
    },
    setProfile(profile) {
      this.profile = profile || null;
    },
    async fetchProfile() {
      if (!this.isAuthenticated) {
        this.profile = null;
        return null;
      }
      this.loading = true;
      try {
        const profile = await userApi.getProfile();
        this.profile = profile || null;
        return this.profile;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      if (!this.isAuthenticated) {
        this.clearTokens();
        return;
      }
      try {
        const body = this.refreshToken ? { refresh_token: this.refreshToken } : {};
        await authApi.logout(body);
      } catch (error) {
        console.warn('logout failed', error);
      } finally {
        this.clearTokens();
      }
    },
  },
});
