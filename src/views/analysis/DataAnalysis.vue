<template>
  <section class="analysis-page">
    <a-card class="analysis-page__card">
      <a-form :model="filters" layout="inline" class="analysis-page__form">
        <a-form-item label="指标关键词">
          <a-input
            v-model:value="filters.keyword"
            allow-clear
            placeholder="营收 / 订单量"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item label="分析维度">
          <a-select
            v-model:value="filters.dimension"
            allow-clear
            placeholder="请选择维度"
            style="width: 160px"
          >
            <a-select-option value="region">
              区域
            </a-select-option>
            <a-select-option value="channel">
              渠道
            </a-select-option>
            <a-select-option value="product">
              商品
            </a-select-option>
            <a-select-option value="time">
              时间
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="统计时间">
          <a-range-picker
            v-model:value="filters.range"
            style="width: 240px"
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

      <div class="analysis-page__toolbar">
        <a-space>
          <a-button type="primary" @click="handleCreate">
            生成分析报表
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
        row-key="analysisId"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'trend'">
            <a-tag :color="trendColor[text]">
              {{ trendMap[text] }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'value'">
            {{ Number(text).toLocaleString() }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleAction('detail', record)">
                查看
              </a-button>
              <a-button type="link" @click="handleAction('compare', record)">
                对比
              </a-button>
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
  dimension: undefined,
  range: [],
});

const trendMap = {
  rising: '环比上涨',
  stable: '保持稳定',
  declining: '环比下降',
};

const trendColor = {
  rising: 'green',
  stable: 'blue',
  declining: 'red',
};

const columns = [
  { title: '分析编号', dataIndex: 'analysisId', width: 160 },
  { title: '统计指标', dataIndex: 'metric', width: 180 },
  { title: '分析维度', dataIndex: 'dimension', width: 140 },
  { title: '当前值', dataIndex: 'value', align: 'right', width: 140 },
  { title: '环比表现', dataIndex: 'trend', width: 140 },
  { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
  { title: '操作', key: 'action', fixed: 'right', width: 160 },
];

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total) => `共 ${total} 条`,
});

const tableData = ref([]);

const generateMockList = (count, offset = 0) => {
  const metrics = ['营收', '订单量', '客单价', '活跃用户', '转化率', '复购率'];
  const dimensions = ['华东', '华北', '线上渠道', '线下渠道', '桶装水', '饮水机'];
  const trends = Object.keys(trendMap);

  return Array.from({ length: count }).map((_, index) => {
    const analysisIndex = offset + index + 1;
    const trend = trends[Math.floor(Math.random() * trends.length)];
    return {
      key: analysisIndex,
      analysisId: `DA-${String(analysisIndex).padStart(5, '0')}`,
      metric: metrics[Math.floor(Math.random() * metrics.length)],
      dimension: dimensions[Math.floor(Math.random() * dimensions.length)],
      value: Math.floor(Math.random() * 9000) + 100,
      trend,
      updatedAt: `2024-${String(Math.ceil(Math.random() * 12)).padStart(2, '0')}-${String(
        Math.ceil(Math.random() * 28),
      ).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(
        Math.floor(Math.random() * 60),
      ).padStart(2, '0')}`,
    };
  });
};

const fetchTableData = () => {
  loading.value = true;
  window.setTimeout(() => {
    const total = 36;
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
  filters.dimension = undefined;
  filters.range = [];
  handleSearch();
};

const refreshTable = () => {
  fetchTableData();
  message.success('数据已刷新');
};

const handleCreate = () => {
  message.success('已生成新的分析报表（示例）');
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
    detail: () => message.info(`查看分析：${record.analysisId}`),
    compare: () => message.info(`发起对比：${record.metric}（${record.dimension}）`),
  };
  actionMap[type]?.();
};

fetchTableData();
</script>

<style scoped lang="scss">
.analysis-page__form {
  margin-bottom: 16px;
  row-gap: 12px;
}

.analysis-page__toolbar {
  margin-bottom: 16px;
}
</style>