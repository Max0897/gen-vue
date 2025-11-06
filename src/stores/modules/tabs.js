import { defineStore } from 'pinia';

const affixView = (view) => view?.meta?.affix;

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    visitedViews: [],
    cachedViewNames: [],
    activeTab: '',
  }),
  getters: {
    includeList(state) {
      return state.cachedViewNames;
    },
  },
  actions: {
    addView(route) {
      if (!route?.name || route.meta?.public) return;

      const exists = this.visitedViews.find((view) => view.name === route.name);
      const title = route.meta?.title || route.name;
      const view = {
        name: route.name,
        title,
        fullPath: route.fullPath,
        path: route.path,
        query: route.query,
        meta: route.meta || {},
        closable: !affixView(route),
      };

      if (!exists) {
        if (affixView(route)) {
          this.visitedViews.unshift(view);
        } else {
          this.visitedViews.push(view);
        }
      } else {
        Object.assign(exists, view);
      }

      if (route.meta?.keepAlive !== false && !this.cachedViewNames.includes(route.name)) {
        this.cachedViewNames.push(route.name);
      }

      this.activeTab = route.name;
    },

    removeView(name) {
      const index = this.visitedViews.findIndex((view) => view.name === name);
      if (index === -1) return null;

      const view = this.visitedViews[index];
      if (!view.closable) {
        return view;
      }

      this.visitedViews.splice(index, 1);
      this.cachedViewNames = this.cachedViewNames.filter((cached) => cached !== name);

      if (this.activeTab === name) {
        const fallback = this.visitedViews[index - 1] || this.visitedViews[index] || this.visitedViews[0] || null;
        this.activeTab = fallback?.name || '';
        return fallback || null;
      }

      return this.visitedViews[index] || this.visitedViews[index - 1] || this.visitedViews[0] || null;
    },

    removeOthers(name) {
      this.visitedViews = this.visitedViews.filter((view) => !view.closable || view.name === name);
      this.cachedViewNames = this.cachedViewNames.filter((cached) => cached === name || this.visitedViews.some((view) => view.name === cached));
      this.activeTab = name;
    },

    removeAll() {
      this.visitedViews = this.visitedViews.filter((view) => !view.closable);
      this.cachedViewNames = this.cachedViewNames.filter((cached) => this.visitedViews.some((view) => view.name === cached));
      this.activeTab = this.visitedViews[0]?.name || '';
      return this.visitedViews[0] || null;
    },

    updateActive(name) {
      this.activeTab = name;
    },

    refreshView(name) {
      this.cachedViewNames = this.cachedViewNames.filter((cached) => cached !== name);
      requestAnimationFrame(() => {
        if (!this.cachedViewNames.includes(name)) {
          this.cachedViewNames.push(name);
        }
      });
    },
  },
});
