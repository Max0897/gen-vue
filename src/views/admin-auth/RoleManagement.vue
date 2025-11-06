<template>
  <section class="role-page">
    <a-card :bordered="false" class="role-page__card">
      <template #title>
        <a-space align="center">
          <span>角色管理</span>
          <a-tag color="purple">权限</a-tag>
        </a-space>
      </template>

      <a-form
        :model="filters"
        layout="inline"
        class="role-page__form"
      >
        <a-form-item label="角色名称">
          <a-input
            v-model:value="filters.name"
            allow-clear
            placeholder="管理员 / 审核员"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="filters.status"
            allow-clear
            placeholder="请选择状态"
            style="width: 160px"
          >
            <a-select-option value="enabled">启用</a-select-option>
            <a-select-option value="disabled">停用</a-select-option>
          </a-select>
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

      <div class="role-page__toolbar">
        <a-space>
          <a-button type="primary" @click="handleCreate">
            新增角色
          </a-button>
          <a-button @click="refreshTable">
            刷新
          </a-button>
        </a-space>
      </div>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        row-key="roleId"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor[text]">
              {{ statusMap[text] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleAction('edit', record)">
                编辑
              </a-button>
              <a-button type="link" @click="handleAction('permission', record)">
                权限设置
              </a-button>
              <a-popconfirm
                title="确认删除该角色？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleAction('remove', record)"
              >
                <a-button type="link" danger>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';

const loading = ref(false);

const filters = reactive({
  name: '',
  status: undefined,
});

const statusMap = {
  enabled: '启用',
  disabled: '停用',
};

const statusColor = {
  enabled: 'green',
  disabled: 'red',
};

const columns = [
  { title: '角色 ID', dataIndex: 'roleId', width: 160 },
  { title: '角色名称', dataIndex: 'name', width: 160 },
  { title: '成员数', dataIndex: 'memberCount', align: 'right', width: 120 },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '描述', dataIndex: 'description' },
  { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
  { title: '操作', key: 'action', fixed: 'right', width: 220 },
];

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total) => `共 ${total} 条`,
});

const tableData = ref([]);

const generateMockList = (count, offset = 0) =>
  Array.from({ length: count }).map((_, index) => {
    const statusKeys = Object.keys(statusMap);
    const status = statusKeys[Math.floor(Math.random() * statusKeys.length)];
    const roleIndex = offset + index + 1;
    return {
      key: roleIndex,
      roleId: `ROLE_${String(roleIndex).padStart(3, '0')}`,
      name: ['超级管理员', '运营管理员', '审核员', '客服'][roleIndex % 4],
      memberCount: Math.floor(Math.random() * 20),
      status,
      description: ['拥有全部权限', '负责日常运营', '负责内容审核', '负责售后支持'][roleIndex % 4],
      updatedAt: `2024-${String(Math.ceil(Math.random() * 12)).padStart(2, '0')}-${String(
        Math.ceil(Math.random() * 28),
      ).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(
        Math.floor(Math.random() * 60),
      ).padStart(2, '0')}`,
    };
  });

const fetchTableData = () => {
  loading.value = true;
  window.setTimeout(() => {
    const total = 12;
    pagination.total = total;
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const remaining = Math.max(total - startIndex, 0);
    const pageCount = Math.min(pagination.pageSize, remaining);
    tableData.value = generateMockList(pageCount, startIndex);
    loading.value = false;
  }, 450);
};

const handleSearch = () => {
  pagination.current = 1;
  fetchTableData();
};

const handleReset = () => {
  filters.name = '';
  filters.status = undefined;
  handleSearch();
};

const refreshTable = () => {
  fetchTableData();
  message.success('角色数据已刷新');
};

const handleCreate = () => {
  message.info('触发新增角色（示例）');
};

const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchTableData();
};

const handleAction = (type, record) => {
  const map = {
    edit: () => message.info(`编辑角色：${record.roleId}`),
    permission: () => message.info(`配置角色权限：${record.roleId}`),
    remove: () => message.success(`已删除角色：${record.roleId}`),
  };
  map[type]?.();
};

fetchTableData();
</script>

<style scoped lang="scss">

.role-page__card {
  border-radius: 12px;
}

.role-page__form {
  margin-bottom: 16px;
  row-gap: 12px;
}

.role-page__toolbar {
  margin-bottom: 16px;
}
</style>
