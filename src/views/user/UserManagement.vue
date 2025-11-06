<template>
  <section class="user-page">
    <a-card class="user-page__card">
      <a-form :model="filters" layout="inline" class="user-page__form">
        <a-form-item label="关键字">
          <a-input v-model:value="filters.keyword" allow-clear placeholder="昵称 / 手机号 / OpenID" style="width: 240px" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              查询
            </a-button>
            <a-button @click="handleReset">
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <div class="user-page__toolbar">
        <a-space>
          <a-button @click="refreshTable" :loading="loading">
            刷新
          </a-button>
        </a-space>
      </div>

      <a-table :columns="columns" :data-source="tableData" :loading="loading" :pagination="pagination" row-key="id"
        size="middle" @change="handleTableChange">
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'deposit'">
            ¥ {{ (Number(text) / 100).toFixed(2) }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleViewDetail(record)">
                查看
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-drawer v-model:open="detailVisible" :width="420" title="用户详情" destroy-on-close>
      <a-descriptions :column="1" bordered size="small">
        <a-descriptions-item label="用户 ID">{{ currentUser?.id }}</a-descriptions-item>
        <a-descriptions-item label="OpenID">{{ currentUser?.openid }}</a-descriptions-item>
        <a-descriptions-item label="昵称">{{ currentUser?.nickname || '-' }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ currentUser?.phone_number || '-' }}</a-descriptions-item>
        <a-descriptions-item label="押金余额">¥ {{ (Number(currentUser?.deposit_balance || 0) / 100).toFixed(2)
          }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ formatDate(currentUser?.created_at) }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{ formatDate(currentUser?.updated_at) }}</a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';

import { userApi } from '@/api';

const loading = ref(false);
const tableData = ref([]);
const detailVisible = ref(false);
const currentUser = ref(null);

const filters = reactive({
  keyword: '',
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total) => `共 ${total} 位用户`,
});

const columns = [
  { title: '用户 ID', dataIndex: 'id', width: 120 },
  { title: '昵称', dataIndex: 'nickname', width: 160 },
  { title: '手机号', dataIndex: 'phone_number', width: 160 },
  { title: '押金余额', dataIndex: 'deposit', width: 140,},
  { title: '创建时间', dataIndex: 'created_at', width: 200 },
  { title: '更新时间', dataIndex: 'updated_at', width: 200 },
  { title: '操作', key: 'action', fixed: 'right', width: 120 },
];

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const mapRecord = (item = {}) => ({
  ...item,
  deposit: item.deposit_balance ?? 0,
  created_at: formatDate(item.created_at),
  updated_at: formatDate(item.updated_at),
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await userApi.listAdminUsers({
      page: pagination.current,
      size: pagination.pageSize,
      keyword: filters.keyword || undefined,
    });
    const list = Array.isArray(res?.list) ? res.list : [];
    tableData.value = list.map(mapRecord);
    pagination.total = res?.total || 0;
  } catch (error) {
    message.error(error?.message || '加载用户数据失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.current = 1;
  fetchUsers();
};

const handleReset = () => {
  filters.keyword = '';
  handleSearch();
};

const refreshTable = () => {
  fetchUsers();
};

const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchUsers();
};

const handleViewDetail = (record) => {
  currentUser.value = record;
  detailVisible.value = true;
};

fetchUsers();
</script>

<style scoped lang="scss">
.user-page {
  padding: 16px 0;
}

.user-page__card {
  border-radius: 12px;
}

.user-page__form {
  margin-bottom: 16px;

  :deep(.ant-form-item) {
    margin-bottom: 12px;
  }
}

.user-page__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
