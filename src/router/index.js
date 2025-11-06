import { createRouter, createWebHistory } from 'vue-router';
import { message } from 'ant-design-vue';
import { adminMenus } from './menu';
import progress from '@/plugins/progress';
import pinia from '@/stores';
import { useTabsStore } from '@/stores/modules/tabs';
import { useUserStore } from '@/stores/modules/user';

const flattenMenusToRoutes = (menus) => {
  const collected = [];

  const traverse = (items) => {
    items.forEach((item) => {
      if (item.component && item.routeName) {
        collected.push({
          path: item.path,
          name: item.routeName,
          component: item.component,
          meta: {
            title: item.label,
            keepAlive: item.keepAlive !== false,
            affix: !!item.affix,
          },
        });
      }

      if (item.children?.length) {
        if (item.path) {
          const firstChild = item.children.find((child) => child.path);
          if (firstChild) {
            collected.push({
              path: item.path,
              redirect: firstChild.path,
            });
          }
        }
        traverse(item.children);
      }
    });
  };

  traverse(menus);

  return collected;
};

const appName = import.meta.env.VITE_APP_NAME;

const routes = [
  {
    path: '/login/scan',
    name: 'ScanLogin',
    component: () => import('@/views/auth/ScanLogin.vue'),
    meta: {
      title: '扫码登录',
      public: true,
    },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: flattenMenusToRoutes(adminMenus),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to, from, next) => {
  if (!progress.isStarted()) {
    progress.start();
  }
  const userStore = useUserStore(pinia);
  const isPublic = Boolean(to.meta?.public);

  if (isPublic) {
    if (to.path === '/login/scan' && userStore.isAuthenticated) {
      const redirectRaw = typeof to.query?.redirect === 'string' ? to.query.redirect : '';
      const redirectTarget = redirectRaw && redirectRaw !== '/login/scan' ? redirectRaw : '/';
      return next(redirectTarget);
    }
    return next();
  }

  if (!userStore.isAuthenticated) {
    return next({
      path: '/login/scan',
      query: { redirect: to.fullPath },
    });
  }

  try {
    if (!userStore.profile && !userStore.loading) {
      await userStore.fetchProfile();
    }
  } catch (error) {
    await userStore.logout();
    message.error('登录状态已过期，请重新扫码登录');
    return next({ path: '/login/scan', query: { redirect: to.fullPath } });
  }

  if (to.path === '/login/scan') {
    const redirectRaw = typeof to.query?.redirect === 'string' ? to.query.redirect : '';
    const redirectTarget = redirectRaw && redirectRaw !== '/login/scan' ? redirectRaw : '/';
    return next(redirectTarget);
  }

  return next();
});

router.afterEach((to) => {
  const pageTitle = to.meta?.title ? `${to.meta.title} - ${appName}管理系统` : `${appName}管理系统`;
  document.title = pageTitle;
  progress.done();

  const tabsStore = useTabsStore(pinia);
  tabsStore.addView(to);
});

router.onError(() => {
  progress.done();
});

export default router;
