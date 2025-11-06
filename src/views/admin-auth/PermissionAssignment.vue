<template>
  <section class="permission-page">
    <a-card :bordered="false" class="permission-page__card">
      <template #title>
        <a-space align="center">
          <span>权限分配</span>
          <a-tag color="geekblue">配置</a-tag>
        </a-space>
      </template>

      <a-row :gutter="16" class="permission-page__body">
        <a-col :xs="24" :lg="8">
          <a-card title="角色列表" size="small" bordered class="permission-page__roles">
            <a-list
              :data-source="roleList"
              bordered
              class="permission-page__role-list"
              size="small"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  :class="['permission-page__role-item', { 'is-active': item.id === activeRole }]"
                  @click="activeRole = item.id"
                >
                  <span>{{ item.name }}</span>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
        <a-col :xs="24" :lg="16">
          <a-card
            title="功能权限"
            size="small"
            bordered
            class="permission-page__tree-card"
          >
            <a-tree
              checkable
              :tree-data="permissionTree"
              v-model:checkedKeys="checkedKeys"
              default-expand-all
            />
            <div class="permission-page__actions">
              <a-space>
                <a-button type="primary" @click="handleSave">
                  保存
                </a-button>
                <a-button @click="handleReset">
                  重置
                </a-button>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const activeRole = ref('ROLE_001');

const roleList = [
  { id: 'ROLE_001', name: '超级管理员' },
  { id: 'ROLE_002', name: '运营管理员' },
  { id: 'ROLE_003', name: '审核员' },
  { id: 'ROLE_004', name: '客服' },
];

const permissionTree = [
  {
    title: '控制台',
    key: 'dashboard',
    children: [{ title: '概览', key: 'dashboard:overview' }],
  },
  {
    title: '订单管理',
    key: 'order',
    children: [
      { title: '订单列表', key: 'order:list' },
      { title: '订单售后', key: 'order:after-sale' },
    ],
  },
  {
    title: '商品管理',
    key: 'product',
    children: [
      { title: '商品列表', key: 'product:list' },
      { title: '商品分类', key: 'product:category' },
    ],
  },
  {
    title: '权限管理',
    key: 'permission',
    children: [
      { title: '角色管理', key: 'permission:role' },
      { title: '权限分配', key: 'permission:assign' },
      { title: '管理员管理', key: 'permission:admin' },
    ],
  },
];

const defaultChecked = ['dashboard:overview', 'order:list', 'product:list', 'permission:role'];
const checkedKeys = ref(defaultChecked);

const handleSave = () => {
  message.success('权限已保存（示例）');
};

const handleReset = () => {
  checkedKeys.value = defaultChecked.slice();
  message.info('已重置为默认权限');
};
</script>

<style scoped lang="scss">
.permission-page__card {
  border-radius: 12px;
}

.permission-page__body {
  margin-top: 12px;
}

.permission-page__roles {
  height: 100%;
}

.permission-page__role-list {
  max-height: 360px;
  overflow: auto;
}

.permission-page__role-item {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 6px 8px;
}

.permission-page__role-item.is-active {
  background: #f0f5ff;
  color: #1677ff;
}

.permission-page__tree-card {
  height: 100%;
}

.permission-page__actions {
  margin-top: 16px;
  text-align: right;
}
</style>
