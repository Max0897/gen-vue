<template>
  <section class="table-demo">
    <a-card class="table-demo__card">
      <a-form :model="filters" layout="inline" class="table-demo__form">
        <a-form-item label="关键字">
          <a-input v-model:value="filters.keyword" allow-clear placeholder="订单号 / 用户名" style="width: 220px" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="filters.status" allow-clear placeholder="请选择状态" style="width: 160px">
            <a-select-option value="pending">
              待处理
            </a-select-option>
            <a-select-option value="processing">
              处理中
            </a-select-option>
            <a-select-option value="completed">
              已完成
            </a-select-option>
            <a-select-option value="cancelled">
              已取消
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="下单时间">
          <a-range-picker v-model:value="filters.createdAt" style="width: 240px" :allow-clear="true"
            format="YYYY-MM-DD" />
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

      <div class="table-demo__toolbar">
        <a-space>
          <a-button type="primary" @click="handleCreate">
            新增
          </a-button>
          <a-button @click="refreshTable">
            刷新
          </a-button>
          <a-button type="default" @click="handleExport">
            导出
          </a-button>
        </a-space>
      </div>

      <a-table :columns="columns" :data-source="tableData" :loading="loading" :pagination="pagination" row-key="orderNo"
        size="middle" @change="handleTableChange">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor[text]">
              {{ statusMap[text] }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'amount'">
            ¥ {{ Number(text).toLocaleString() }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleAction('detail', record)">
                查看
              </a-button>
              <a-button type="link" @click="handleAction('edit', record)">
                编辑
              </a-button>
              <a-popconfirm title="确认删除该记录？" ok-text="确定" cancel-text="取消" @confirm="handleAction('remove', record)">
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
  keyword: '',
  status: undefined,
  createdAt: [],
});

const statusMap = {
  pending: '待处理',
  processing: '处理中',
  completed: '已完成',
  cancelled: '已取消',
};

const statusColor = {
  pending: 'orange',
  processing: 'blue',
  completed: 'green',
  cancelled: 'red',
};

const columns = [
  { title: '订单号', dataIndex: 'orderNo', width: 160 },
  { title: '用户', dataIndex: 'customer', width: 140 },
  { title: '下单时间', dataIndex: 'createdAt', width: 180 },
  { title: '金额', dataIndex: 'amount', align: 'right', width: 140 },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '操作', key: 'action', fixed: 'right', width: 180 },
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
    const orderIndex = offset + index + 1;
    return {
      key: orderIndex,
      orderNo: `FW${new Date().getFullYear()}${String(orderIndex).padStart(5, '0')}`,
      customer: ['张三', '李四', '王五', '赵六', '周七'][Math.floor(Math.random() * 5)],
      createdAt: `2024-${String(Math.ceil(Math.random() * 12)).padStart(2, '0')}-${String(Math.ceil(Math.random() * 28)).padStart(2, '0')} 1${Math.floor(Math.random() * 10)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      amount: Math.floor(Math.random() * 900) + 80,
      status,
    };
  });

const fetchTableData = () => {
  loading.value = true;
  window.setTimeout(() => {
    const total = 42;
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
  filters.keyword = '';
  filters.status = undefined;
  filters.createdAt = [];
  handleSearch();
};

const refreshTable = () => {
  fetchTableData();
  message.success('数据已刷新');
};

const handleCreate = () => {
  message.info('触发新增操作（示例）');
};

const handleExport = () => {
  message.success('导出成功（示例）');
};

const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchTableData();
};

const handleAction = (type, record) => {
  const actionMap = {
    detail: () => message.info(`查看订单：${record.orderNo}`),
    edit: () => message.info(`编辑订单：${record.orderNo}`),
    remove: () => message.success(`已删除订单：${record.orderNo}`),
  };
  actionMap[type]?.();
};

fetchTableData();
</script>

<style scoped lang="scss">
.table-demo__card {
  border-radius: 12px;
}

.table-demo__form {
  margin-bottom: 16px;
  row-gap: 12px;
}

.table-demo__toolbar {
  margin-bottom: 16px;
}
</style>
