<template>
  <section class="product-page">
    <a-card :bordered="false" class="product-page__card">
      <template #title>
        <a-space align="center">
          <span>商品列表</span>
          <a-tag color="cyan">管理</a-tag>
        </a-space>
      </template>

      <a-form
        :model="filters"
        layout="inline"
        class="product-page__form"
      >
        <a-form-item label="关键词">
          <a-input
            v-model:value="filters.keyword"
            allow-clear
            placeholder="商品名称 / 编码 / 条码"
            style="width: 240px"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="filters.status"
            allow-clear
            placeholder="请选择状态"
            style="width: 160px"
          >
            <a-select-option value="draft">待上架</a-select-option>
            <a-select-option value="selling">销售中</a-select-option>
            <a-select-option value="soldout">已售罄</a-select-option>
            <a-select-option value="offline">已下架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分类">
          <a-select
            v-model:value="filters.category"
            allow-clear
            placeholder="请选择分类"
            style="width: 180px"
          >
            <a-select-option value="water">桶装水</a-select-option>
            <a-select-option value="device">设备器材</a-select-option>
            <a-select-option value="accessory">配件耗材</a-select-option>
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

      <div class="product-page__toolbar">
        <a-space>
          <a-button type="primary" @click="handleCreate">
            新增商品
          </a-button>
          <a-button @click="refreshTable">
            刷新
          </a-button>
          <a-button type="default" @click="handleExport">
            导出
          </a-button>
        </a-space>
      </div>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        row-key="productNo"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor[text]">
              {{ statusMap[text] }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'price'">
            ¥ {{ Number(text).toFixed(2) }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleAction('detail', record)">
                查看
              </a-button>
              <a-button type="link" @click="handleAction('edit', record)">
                编辑
              </a-button>
              <a-popconfirm
                title="确认下架该商品？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleAction('offline', record)"
              >
                <a-button type="link" danger>
                  下架
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
  category: undefined,
});

const statusMap = {
  draft: '待上架',
  selling: '销售中',
  soldout: '已售罄',
  offline: '已下架',
};

const statusColor = {
  draft: 'orange',
  selling: 'green',
  soldout: 'red',
  offline: 'default',
};

const columns = [
  { title: '商品编号', dataIndex: 'productNo', width: 160 },
  { title: '商品名称', dataIndex: 'name', width: 220 },
  { title: '分类', dataIndex: 'category', width: 140 },
  { title: '售价', dataIndex: 'price', align: 'right', width: 120 },
  { title: '库存', dataIndex: 'stock', align: 'right', width: 100 },
  { title: '状态', dataIndex: 'status', width: 120 },
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
    const productIndex = offset + index + 1;
    return {
      key: productIndex,
      productNo: `SP${new Date().getFullYear()}${String(productIndex).padStart(5, '0')}`,
      name: ['纯净水套餐', '矿泉水组合', '桶装水套装', '饮水机套餐'][Math.floor(Math.random() * 4)],
      category: ['桶装水', '设备器材', '配件耗材'][Math.floor(Math.random() * 3)],
      price: Math.random() * 120 + 10,
      stock: Math.floor(Math.random() * 600),
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
    const total = 55;
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
  filters.category = undefined;
  handleSearch();
};

const refreshTable = () => {
  fetchTableData();
  message.success('商品数据已刷新');
};

const handleCreate = () => {
  message.info('触发新增商品（示例）');
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
    detail: () => message.info(`查看商品：${record.productNo}`),
    edit: () => message.info(`编辑商品：${record.productNo}`),
    offline: () => message.success(`已下架商品：${record.productNo}`),
  };
  map[type]?.();
};

fetchTableData();
</script>

<style scoped lang="scss">

.product-page__card {
  border-radius: 12px;
}

.product-page__form {
  margin-bottom: 16px;
  row-gap: 12px;
}

.product-page__toolbar {
  margin-bottom: 16px;
}
</style>
