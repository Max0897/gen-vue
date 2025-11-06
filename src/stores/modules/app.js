import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false,
  }),
  actions: {
    toggleMenu(value) {
      if (typeof value === 'boolean') {
        this.collapsed = value;
      } else {
        this.collapsed = !this.collapsed;
      }
    },
  },
});
