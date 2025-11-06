<template>
  <section class="system-logs">
    <a-card class="system-logs__card">
      <a-form :model="filters" layout="inline" class="system-logs__form">
        <a-form-item label="操作人员">
          <a-input
            v-model:value="filters.operator"
            allow-clear
            placeholder="管理员姓名 / 编号"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item label="日志类型">
          <a-select
            v-model:value="filters.module"
            allow-clear
            placeholder="请选择类型"
            style="width: 160px"
          >
            <a-select-option value="auth">
              登录安全
            </a-select-option>
            <a-select-option value="order">
              订单服务
            </a-select-option>
            <a-select-option value="system">
              系统配置
            </a-select-option>
            <a-select-option value="mission">
              派送调度
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间范围">
          <a-range-picker
            v-model:value="filters.range"
            style="width: 240px"
            :allow-clear="true"
            show-time
            format="YYYY-MM-DD HH:mm"
          />
        </a-form-item>
        <a-form-item label="级别">
          <a-select
            v-model:value="filters.level"
            allow-clear
            placeholder="请选择级别"
            style="width: 140px"
          >
            <a-select-option value="info">
              Info
            </a-select-option>
            <a-select-option value="warning">
              Warning
            </a-select-option>
            <a-select-option value="error">
              Error
            </a-select-option>
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

      <div class="system-logs__toolbar">
        <a-space>
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
        row-key="logId"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'level'">
            <a-tag :color="levelColor[text]">
              {{ levelMap[text] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleAction('detail', record)">
                查看详情
              </a-button>
              <a-button type="link" danger @click="handleAction('remove', record)">
                删除
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
  operator: '',
  module: undefined,
  level: undefined,
  range: [],
});

const levelMap = {
  info: '信息',
  warning: '警告',
  error: '错误',
};

const levelColor = {
  info: 'blue',
  warning: 'orange',
  error: 'red',
};

const columns = [
  { title: '日志编号', dataIndex: 'logId', width: 160 },
  { title: '模块', dataIndex: 'module', width: 140 },
  { title: '级别', dataIndex: 'level', width: 120 },
  { title: '内容摘要', dataIndex: 'message', ellipsis: true },
  { title: '操作人', dataIndex: 'operator', width: 140 },
  { title: '来源 IP', dataIndex: 'ip', width: 150 },
  { title: '记录时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', key: 'action', fixed: 'right', width: 180 },
];

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total) => `共 ${total} 条`,
});

const tableData = ref([]);

const generateMockList = (count, offset = 0) => {
  const modules = ['登录安全', '订单服务', '系统配置', '派送调度'];
  const levels = Object.keys(levelMap);
  const messages = [
    '管理员登录成功',
    '修改派送路线配置',
    '批量导出订单数据',
    '支付回执重试成功',
    '用户押金退款失败重试',
    '系统参数校验异常',
  ];
  const operators = ['陈亮', '王华', '赵敏', '李娜', '孙杰'];

  return Array.from({ length: count }).map((_, index) => {
    const logIndex = offset + index + 1;
    const level = levels[Math.floor(Math.random() * levels.length)];
    return {
      key: logIndex,
      logId: `LOG-${String(logIndex).padStart(5, '0')}`,
      module: modules[Math.floor(Math.random() * modules.length)],
      level,
      message: messages[Math.floor(Math.random() * messages.length)],
      operator: operators[Math.floor(Math.random() * operators.length)],
      ip: `192.168.${Math.floor(Math.random() * 40)}.${Math.floor(Math.random() * 200) + 1}`,
      createdAt: `2024-${String(Math.ceil(Math.random() * 12)).padStart(2, '0')}-${String(
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
    const total = 58;
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
  filters.operator = '';
  filters.module = undefined;
  filters.level = undefined;
  filters.range = [];
  handleSearch();
};

const refreshTable = () => {
  fetchTableData();
  message.success('数据已刷新');
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
    detail: () => message.info(`查看日志：${record.logId}`),
    remove: () => message.success(`已删除日志：${record.logId}`),
  };
  actionMap[type]?.();
};

fetchTableData();
</script>

<style scoped lang="scss">
.system-logs__form {
  margin-bottom: 16px;
  row-gap: 12px;
}

.system-logs__toolbar {
  margin-bottom: 16px;
}
</style>
