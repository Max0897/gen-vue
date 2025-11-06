<template>
  <section class="home__content">
    <a-row :gutter="[16, 16]">
      <a-col v-for="item in metrics" :key="item.key" :xs="24" :sm="12" :lg="6">
        <a-card class="home__metric-card">
          <div class="home__metric">
            <div class="home__metric-title">
              {{ item.label }}
            </div>
            <a-statistic :title="item.subtitle" :value="item.value" :prefix="item.prefix" :suffix="item.suffix" />
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" class="home__section">
      <a-col :xs="24" :lg="8">
        <a-card title="今日提醒" style="border-radius: 12px; height: 100%;">
          <ul class="home__todo">
            <li>及时处理待发货订单，避免逾期</li>
            <li>关注库存预警商品，提前补货</li>
            <li>检查最新优惠活动曝光，确保转化率</li>
          </ul>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card title="订单统计" style="border-radius: 12px;height: 100%;">
          <template #extra>
            <a-space>
              <a-button type="link" @click="refreshData">
                刷新数据
              </a-button>
            </a-space>
          </template>
          <a-table :columns="orderColumns" :data-source="orderStats" :pagination="false" row-key="type" size="small" />
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card title="订单统计" style="border-radius: 12px;height: 100%;">
          <template #extra>
            <a-space>
              <a-button type="link" @click="refreshData">
                刷新数据
              </a-button>
            </a-space>
          </template>
          <a-table :columns="orderColumns" :data-source="orderStats" :pagination="false" row-key="type" size="small" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" class="home__section">
      <a-col :xs="24" :lg="16">
        <a-card title="7 日订单走势" style="border-radius: 12px;">
          <div ref="orderChartRef" class="home__chart" />
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card title="商品销售分布" style="border-radius: 12px;">
          <div ref="productChartRef" class="home__product-chart" />
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const baseData = () => ({
  users: randomInt(1200, 3500),
  turnover: randomInt(20, 85) * 10000,
  orders: randomInt(450, 1200),
  pending: randomInt(10, 60),
  processing: randomInt(40, 120),
  completed: randomInt(380, 900),
  cancelled: randomInt(5, 30),
});

const dashboard = ref(baseData());

const metrics = computed(() => [
  { key: 'users', label: '用户总量', subtitle: '较昨日 +3.2%', value: dashboard.value.users },
  {
    key: 'turnover',
    label: '成交总额',
    subtitle: '单位：元',
    value: dashboard.value.turnover,
    prefix: '¥',
  },
  { key: 'orders', label: '订单总量', subtitle: '较昨日 +1.7%', value: dashboard.value.orders },
  {
    key: 'conversion',
    label: '订单转化率',
    subtitle: '较昨日 +0.4%',
    value: Number(
      ((dashboard.value.completed / Math.max(dashboard.value.orders, 1)) * 100).toFixed(1),
    ),
    suffix: '%',
  },
]);

const orderColumns = [
  { dataIndex: 'type', title: '订单类型' },
  { dataIndex: 'count', title: '数量' },
  { dataIndex: 'trend', title: '较昨日' },
];

const orderStats = computed(() => [
  { type: '待处理', count: dashboard.value.pending, trend: `+${randomInt(1, 6)} 单` },
  { type: '处理中', count: dashboard.value.processing, trend: `+${randomInt(2, 8)} 单` },
  { type: '已完成', count: dashboard.value.completed, trend: `+${randomInt(10, 25)} 单` },
  { type: '已取消', count: dashboard.value.cancelled, trend: `-${randomInt(1, 4)} 单` },
]);

const orderChartRef = ref(null);
const productChartRef = ref(null);
let orderChartInstance = null;
let productChartInstance = null;

const createChartData = () => {
  const labels = Array.from({ length: 7 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - idx));
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const values = labels.map(() => randomInt(120, 420));
  return { labels, values };
};

const renderOrderChart = () => {
  if (!orderChartRef.value) return;

  if (!orderChartInstance) {
    orderChartInstance = echarts.init(orderChartRef.value);
  }

  const { labels, values } = createChartData();

  orderChartInstance.setOption({
    grid: {
      left: 16,
      right: 16,
      top: 40,
      bottom: 16,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const [item] = params;
        return `${item.axisValue}<br/>订单量：${item.data}`;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { color: '#8c8c8c' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#e5e5e5' } },
      axisLabel: { color: '#8c8c8c' },
    },
    series: [
      {
        name: '订单量',
        type: 'line',
        smooth: true,
        data: values,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#1677ff', width: 3 },
        itemStyle: { color: '#1677ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(22, 119, 255, 0.25)' },
            { offset: 1, color: 'rgba(22, 119, 255, 0.02)' },
          ]),
        },
      },
    ],
  });
};

const createProductSalesData = () => {
  const categories = ['桶装水', '饮水机', '纸杯耗材', '配件耗材', '促销礼品'];
  const data = categories.map((name) => ({
    name,
    value: randomInt(120, 650),
  }));
  return data.sort((a, b) => b.value - a.value);
};

const renderProductChart = () => {
  if (!productChartRef.value) return;
  if (!productChartInstance) {
    productChartInstance = echarts.init(productChartRef.value);
  }

  const data = createProductSalesData();
  productChartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>销量：{c} 单 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#666' },
    },
    series: [
      {
        name: '销量占比',
        type: 'pie',
        radius: ['40%', '70%'],
        data,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          formatter: '{b}\n{d}%',
        },
        emphasis: {
          scale: true,
        },
      },
    ],
  });
};

const handleResize = () => {
  orderChartInstance?.resize();
  productChartInstance?.resize();
};

const refreshData = () => {
  dashboard.value = baseData();
  renderOrderChart();
  renderProductChart();
};

onMounted(() => {
  renderOrderChart();
  renderProductChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (orderChartInstance) {
    orderChartInstance.dispose();
    orderChartInstance = null;
  }
  if (productChartInstance) {
    productChartInstance.dispose();
    productChartInstance = null;
  }
});
</script>

<style scoped lang="scss">
.home__metric-card {
  border-radius: 12px;
}

.home__metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home__metric-title {
  font-weight: 600;
  font-size: 16px;
}

.home__section {
  margin-top: 16px;
}

.home__chart {
  width: 100%;
  height: 280px;
}

.home__product-chart {
  width: 100%;
  height: 280px;
}

.home__todo {
  margin: 0;
  padding-left: 16px;
  list-style: disc;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.8;
}
</style>
