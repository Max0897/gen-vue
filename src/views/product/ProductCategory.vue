<template>
  <section class="product-category">
    <a-card :bordered="false" class="product-category__card">
      <template #title>
        <a-space align="center">
          <span>商品分类</span>
          <a-tag color="gold">配置</a-tag>
        </a-space>
      </template>

      <a-form
        :model="filters"
        layout="inline"
        class="product-category__form"
      >
        <a-form-item label="关键字">
          <a-input
            v-model:value="filters.keyword"
            allow-clear
            placeholder="分类名称 / 编码"
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

      <div class="product-category__toolbar">
        <a-space>
          <a-button type="primary" @click="handleCreate">
            新增分类
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
        row-key="categoryNo"
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
              <a-popconfirm
                title="确认删除该分类？"
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
  keyword: '',
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
  { title: '分类编号', dataIndex: 'categoryNo', width: 160 },
  { title: '分类名称', dataIndex: 'name', width: 180 },
  { title: '排序', dataIndex: 'sort', align: 'right', width: 80 },
  { title: '商品数量', dataIndex: 'productCount', align: 'right', width: 120 },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
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
    const categoryIndex = offset + index + 1;
    return {
      key: categoryIndex,
      categoryNo: `CT${new Date().getFullYear()}${String(categoryIndex).padStart(4, '0')}`,
      name: ['桶装水', '饮水设备', '配件耗材', '优惠套餐'][Math.floor(Math.random() * 4)],
      sort: Math.floor(Math.random() * 10) + 1,
      productCount: Math.floor(Math.random() * 200),
      status,
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
    const total = 18;
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
  handleSearch();
};

const refreshTable = () => {
  fetchTableData();
  message.success('分类数据已刷新');
};

const handleCreate = () => {
  message.info('触发新增分类（示例）');
};

const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchTableData();
};

const handleAction = (type, record) => {
  const map = {
    edit: () => message.info(`编辑分类：${record.categoryNo}`),
    remove: () => message.success(`已删除分类：${record.categoryNo}`),
  };
  map[type]?.();
};

fetchTableData();
</script>

<style scoped lang="scss">

.product-category__card {
  border-radius: 12px;
}

.product-category__form {
  margin-bottom: 16px;
  row-gap: 12px;
}

.product-category__toolbar {
  margin-bottom: 16px;
}
</style>
