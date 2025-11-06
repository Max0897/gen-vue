<template>
  <a-layout class="admin-layout">
    <a-layout-sider
      collapsible
      :collapsed="appStore.collapsed"
      :width="180"
      @collapse="appStore.toggleMenu"
    >
      <div class="admin-layout__logo">
        <span v-if="!appStore.collapsed">{{ appName }}管理系统</span>
        <span v-else>{{ appName }}</span>
      </div>
      <a-menu
        :selectedKeys="selectedKeys"
        :openKeys="openKeys"
        theme="dark"
        mode="inline"
        @openChange="handleOpenChange"
        @click="handleMenuClick"
      >
        <template
          v-for="item in menuItems"
          :key="item.key || item.routeName"
        >
          <a-sub-menu
            v-if="item.children?.length"
            :key="item.key"
          >
            <template #title>
              <component
                v-if="item.icon"
                :is="item.icon"
                style="font-size: 16px;"
                class="admin-layout__menu-icon"
              />
              <span>{{ item.label }}</span>
            </template>
            <a-menu-item
              v-for="child in item.children"
              :key="child.routeName"
            >
              <component
                v-if="child.icon"
                :is="child.icon"
                style="font-size: 16px;"
                class="admin-layout__menu-icon"
              />
              <span>{{ child.label }}</span>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item
            v-else
            :key="item.routeName"
          >
            <component
              v-if="item.icon"
              :is="item.icon"
              style="font-size: 16px;"
              class="admin-layout__menu-icon"
            />
            <span>{{ item.label }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="admin-layout__header">
        <div class="admin-layout__header-left">
          <a-typography-title :level="4" class="admin-layout__title">
            {{ currentTitle }}
          </a-typography-title>
        </div>
        <div class="admin-layout__header-right">
          <a-space align="center">
            <a-dropdown>
              <a-space class="admin-layout__user" align="center">
                <a-avatar size="small">
                  {{ avatarText }}
                </a-avatar>
                <span class="admin-layout__user-name">
                  {{ displayName }}
                </span>
              </a-space>
              <template #overlay>
                <a-menu @click="handleUserMenu">
                  <a-menu-item key="logout">
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>
      <div class="admin-layout__tabs-bar" v-if="tabs.length">
        <a-tabs
          type="editable-card"
          size="small"
          hide-add
          :activeKey="activeTabKey"
          @change="handleTabChange"
          @edit="handleTabEdit"
        >
          <a-tab-pane
            v-for="tab in tabs"
            :key="tab.name"
            :tab="tab.title"
            :closable="tab.closable"
          />
        </a-tabs>
        
        <a-dropdown>
          <a-button type="text" :icon="h(AppstoreOutlined)"></a-button>
          <template #overlay>
            <a-menu @click="handleTabMenu">
              <a-menu-item key="refresh">
                刷新当前
              </a-menu-item>
              <a-menu-item key="closeOthers">
                关闭其他
              </a-menu-item>
              <a-menu-item key="closeAll">
                关闭全部
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <a-layout-content class="admin-layout__content">
        <div v-if="reloadFlag" class="admin-layout__view-wrapper">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-slide" mode="out-in">
              <component
                v-if="route.meta?.keepAlive === false"
                :is="Component"
                :key="route.fullPath"
              />
              <keep-alive v-else :include="cachedViewNames">
                <component :is="Component" :key="route.name" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, nextTick, ref, watch, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores';
import { adminMenus } from '@/router/menu';
import { useTabsStore } from '@/stores/modules/tabs';

import { AppstoreOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/modules/user';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const tabsStore = useTabsStore();
const userStore = useUserStore();

const appName = import.meta.env.VITE_APP_NAME;

const menuItems = adminMenus;

const flattenMenus = (menus, parentKey = null) => {
  const result = [];

  menus.forEach((item) => {
    if (item.routeName) {
      result.push({
        routeName: item.routeName,
        label: item.label,
        parentKey,
      });
    }

    if (item.children?.length) {
      result.push(...flattenMenus(item.children, item.key ?? item.routeName));
    }
  });

  return result;
};

const flatMenus = computed(() => flattenMenus(menuItems));

const defaultRouteName = computed(() => flatMenus.value[0]?.routeName);

const selectedKeys = computed(() => {
  const current = flatMenus.value.find((item) => item.routeName === route.name);
  const key = current?.routeName ?? defaultRouteName.value;
  return key ? [key] : [];
});

const displayName = computed(() => userStore.profile?.nickname || userStore.profile?.phone_number || '管理员');
const avatarText = computed(() => {
  const text = displayName.value;
  if (!text) {
    return 'FA';
  }
  return text.slice(0, 2).toUpperCase();
});

const openKeys = ref([]);
const cachedOpenKeys = ref([]);
const reloadFlag = ref(true);

const syncOpenKeys = () => {
  const current = flatMenus.value.find((item) => item.routeName === route.name);
  if (current?.parentKey) {
    openKeys.value = [current.parentKey];
  } else {
    openKeys.value = [];
  }
};

watch(
  () => route.name,
  (name) => {
    syncOpenKeys();
    if (name) {
      tabsStore.updateActive(name);
    }
  },
  { immediate: true },
);

const currentTitle = computed(() => {
  const current = flatMenus.value.find((item) => item.routeName === route.name);
  return route.meta?.title ?? current?.label ?? '';
});

const tabs = computed(() => tabsStore.visitedViews);
const cachedViewNames = computed(() => tabsStore.includeList);
const activeTabKey = computed(() => tabsStore.activeTab || route.name || '');

const handleMenuClick = ({ key }) => {
  router.push({ name: key });
};

const handleOpenChange = (keys) => {
  openKeys.value = keys;
};

watch(
  () => appStore.collapsed,
  (collapsed) => {
    if (collapsed) {
      cachedOpenKeys.value = openKeys.value.slice();
      openKeys.value = [];
    } else {
      openKeys.value = cachedOpenKeys.value.slice();
    }
  },
);

const handleTabChange = (key) => {
  const target = tabs.value.find((item) => item.name === key);
  if (!target) return;
  if (target.fullPath !== route.fullPath) {
    router.push(target.fullPath);
  }
};

const handleTabEdit = (targetKey) => {
  const fallback = tabsStore.removeView(String(targetKey));
  const target = fallback || tabsStore.visitedViews[0];
  if (target && target.name !== route.name) {
    router.push(target.fullPath);
  }
};

const triggerReload = () => {
  reloadFlag.value = false;
  nextTick(() => {
    reloadFlag.value = true;
  });
};

const handleTabMenu = ({ key }) => {
  const currentName = route.name;
  switch (key) {
    case 'refresh':
      if (currentName) {
        tabsStore.refreshView(currentName);
        triggerReload();
      }
      break;
    case 'closeOthers':
      if (currentName) {
        tabsStore.removeOthers(currentName);
      }
      break;
    case 'closeAll': {
      const fallback = tabsStore.removeAll();
      const target = fallback || tabsStore.visitedViews[0];
      if (target && target.name !== route.name) {
        router.push(target.fullPath);
      }
      break;
    }
    default:
      break;
  }
};

const handleUserMenu = async ({ key }) => {
  if (key !== 'logout') {
    return;
  }

  await userStore.logout();
  message.success('已退出登录');
  tabsStore.removeAll();
  router.push('/login/scan');
};
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
}

.admin-layout__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-layout__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.admin-layout__title {
  margin-bottom: 0;
  font-weight: 600;
}

.admin-layout__tabs-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px 0;
  background: #fff;

  :deep(.ant-tabs-nav) {
    margin-bottom: 0;
    &::before{
      display: none;
    }
  }
}

.admin-layout__tabs-bar :deep(.ant-tabs) {
  flex: 1;
  margin-bottom: 0;
}

.admin-layout__menu-icon {
  font-size: 16px;
}

.admin-layout__user {
  cursor: pointer;
}

.admin-layout__user-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
}

.admin-layout__content {
  margin: 18px;
  min-height: calc(100vh - 150px);
}

.admin-layout__view-wrapper {
  
}
</style>
