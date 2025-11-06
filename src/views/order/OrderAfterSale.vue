<template>
  <section class="order-after-sale">
    <a-card :bordered="false" class="order-after-sale__card">
      <template #title>
        <a-space align="center">
          <span>订单售后</span>
          <a-tag color="purple">售后</a-tag>
        </a-space>
      </template>

      <a-form
        :model="filters"
        layout="inline"
        class="order-after-sale__form"
      >
        <a-form-item label="售后单号">
          <a-input
            v-model:value="filters.afterSaleNo"
            allow-clear
            placeholder="请输入售后单号"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item label="售后类型">
          <a-select
            v-model:value="filters.type"
            allow-clear
            placeholder="请选择类型"
            style="width: 160px"
          >
            <a-select-option value="refund">仅退款</a-select-option>
            <a-select-option value="return">退货退款</a-select-option>
            <a-select-option value="exchange">换货</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="处理状态">
          <a-select
            v-model:value="filters.status"
            allow-clear
            placeholder="请选择状态"
            style="width: 160px"
          >
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="processing">处理中</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="rejected">已驳回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="申请时间">
          <a-range-picker
            v-model:value="filters.appliedAt"
            style="width: 260px"
            :allow-clear="true"
            format="YYYY-MM-DD"
          />
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

      <div class="order-after-sale__toolbar">
        <a-space>
          <a-button @click="refreshTable">
            刷新
          </a-button>
          <a-button type="primary" ghost @click="handleExport">
            导出
          </a-button>
        </a-space>
      </div>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        row-key="afterSaleNo"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'type'">
            {{ typeMap[text] }}
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor[text]">
              {{ statusMap[text] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleAction('detail', record)">
                查看
              </a-button>
              <a-button type="link" @click="handleAction('audit', record)">
                审核
              </a-button>
              <a-popconfirm
                title="确认关闭该售后单？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleAction('close', record)"
              >
                <a-button type="link" danger>
                  关闭
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
  afterSaleNo: '',
  type: undefined,
  status: undefined,
  appliedAt: [],
});

const typeMap = {
  refund: '仅退款',
  return: '退货退款',
  exchange: '换货',
};

const statusMap = {
  pending: '待审核',
  processing: '处理中',
  completed: '已完成',
  rejected: '已驳回',
};

const statusColor = {
  pending: 'orange',
  processing: 'blue',
  completed: 'green',
  rejected: 'red',
};

const columns = [
  { title: '售后单号', dataIndex: 'afterSaleNo', width: 160 },
  { title: '订单号', dataIndex: 'orderNo', width: 160 },
  { title: '用户', dataIndex: 'customer', width: 140 },
  { title: '联系方式', dataIndex: 'phone', width: 140 },
  { title: '售后类型', dataIndex: 'type', width: 120 },
  { title: '申请时间', dataIndex: 'appliedAt', width: 180 },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '操作', key: 'action', fixed: 'right', width: 200 },
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
    const typeKeys = Object.keys(typeMap);
    const status = statusKeys[Math.floor(Math.random() * statusKeys.length)];
    const type = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    const afterSaleIndex = offset + index + 1;
    return {
      key: afterSaleIndex,
      afterSaleNo: `AS${new Date().getFullYear()}${String(afterSaleIndex).padStart(5, '0')}`,
      orderNo: `FW${new Date().getFullYear()}${String(afterSaleIndex + 10).padStart(5, '0')}`,
      customer: ['刘备', '关羽', '张飞', '赵云', '诸葛亮'][Math.floor(Math.random() * 5)],
      phone: `139${Math.floor(10000000 + Math.random() * 89999999)}`,
      type,
      appliedAt: `2024-${String(Math.ceil(Math.random() * 12)).padStart(2, '0')}-${String(
        Math.ceil(Math.random() * 28),
      ).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(
        Math.floor(Math.random() * 60),
      ).padStart(2, '0')}`,
      status,
    };
  });

const fetchTableData = () => {
  loading.value = true;
  window.setTimeout(() => {
    const total = 24;
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
  filters.afterSaleNo = '';
  filters.type = undefined;
  filters.status = undefined;
  filters.appliedAt = [];
  handleSearch();
};

const refreshTable = () => {
  fetchTableData();
  message.success('售后数据已刷新');
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
  const map = {
    detail: () => message.info(`查看售后单：${record.afterSaleNo}`),
    audit: () => message.info(`审核售后单：${record.afterSaleNo}`),
    close: () => message.success(`已关闭售后单：${record.afterSaleNo}`),
  };
  map[type]?.();
};

fetchTableData();
</script>

<style scoped lang="scss">

.order-after-sale__card {
  border-radius: 12px;
}

.order-after-sale__form {
  margin-bottom: 16px;
  row-gap: 12px;
}

.order-after-sale__toolbar {
  margin-bottom: 16px;
}
</style>
