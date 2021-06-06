<template>
  <el-row>
    <el-col :span="18">
      <div class="chart">
        <div class="options">
          <span class="data_option">
            <el-select
              class="gateway"
              v-model="value"
              clearable
              placeholder="請選擇 gateway"
              @change="getGateways"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
          <span>
            <el-select
              v-model="value1"
              clearable
              placeholder="請選擇 sensor"
              @change="updateData"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
        </div>

        <el-card class="line-chart">
          <vue3-chart-js ref="lineChartRef" v-bind="{ ...lineChart }" />
        </el-card>
      </div>
    </el-col>

    <el-col :span="6">
      <el-card class="box-card" shadow="hover">
        <div class="card-header">
          <span>濕度資訊</span>
        </div>
        <div class="card-content">
          <p>{{ tab }}狀態：{{ state }}</p>
          <p>狀態內容：</p>
          <p>{{ stateInfo }}</p>
          <p>目前{{ tab }}：</p>
          <p>{{ now }}</p>
          <p>注意上限：</p>
          <p>{{ upper2 }}</p>
          <p>注意下限：</p>
          <p>{{ lower2 }}</p>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row> </el-row>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

const options = reactive([]);
const value = ref("");
const value1 = ref("");
const options1 = reactive([]);
const tab = ref("");
const state = ref("");
const stateInfo = ref("");
const now = ref("");
const upper1 = ref("");
const lower1 = ref("");
const upper2 = ref("");
const lower2 = ref("");
const lineChartRef = ref(null);
const lineChart = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        fill: false,
        borderColor: "#9e9e9e",
      },
      {
        label: "安全上限",
        data: [],
        fill: false,
        borderColor: "#fdd835",
      },
      {
        label: "安全下限",
        data: [],
        fill: false,
        borderColor: "#fdd835",
      },
      {
        label: "注意上限",
        data: [],
        fill: false,
        borderColor: "#ff9800",
      },
      {
        label: "注意下限",
        data: [],
        fill: false,
        borderColor: "#ff9800",
      },
      {
        label: "物理界線1",
        data: [],
        fill: false,
      },
      {
        label: "物理界線2",
        data: [],
        fill: false,
      },
    ],
  },
  options: {
    plugins: {
      zoom: {
        zoom: {
          enabled: true,
          mode: "y",
        },
      },
    },
  },
};
const TempHumData = [];
const TempHum = getTempHum();
TempHumData.push(...TempHum);

function updateData() {
  updateChart();
  updateInfo();
}

onMounted(() => {
  updateData();
});
onUnmounted(() => {
  clearInterval(timer);
});

const timer = setInterval(() => {
  const TempHumData = [];
  const TempHum = getTempHum();
  TempHumData.push(...TempHum);
  updateData();
}, 5000);

function updateChart() {
  lineChart.data.labels = TempHumData.map((data) => {
    console.log(data);
    return data.index_date;
  });
  lineChart.data.datasets[0].data = TempHumData.map((data) => {
    return data.value;
  });
  lineChart.data.datasets[1].data = TempHumData.map((data) => {
    return data.ai_power_upperbound1;
  });
  lineChart.data.datasets[2].data = TempHumData.map((data) => {
    return data.ai_power_lowerbound1;
  });
  lineChart.data.datasets[3].data = TempHumData.map((data) => {
    return data.ai_power_upperbound2;
  });
  lineChart.data.datasets[4].data = TempHumData.map((data) => {
    return data.ai_power_lowerbound2;
  });
  const type = TempHumData.map((data) => {
    return data.type;
  });
  if (type[0] == 0) {
    lineChart.data.datasets[0].label = "溫度";
    lineChart.data.datasets[5].data = Array(3).fill(10);
    lineChart.data.datasets[6].data = Array(3).fill(38);
  } else if (type[0] == 1) {
    lineChart.data.datasets[0].label = "濕度";
    lineChart.data.datasets[6].data = Array(3).fill(30);
    lineChart.data.datasets[5].data = Array(3).fill(100);
  }
  lineChartRef.value.update(250);
}

function updateInfo() {
  const type = TempHumData.map((data) => {
    return data.type;
  });
  if (type[0] == 0) {
    tab.value = "溫度";
  } else if (type[0] == 1) {
    tab.value = "濕度";
  }
  const stateNo = TempHumData[TempHumData.length - 1].alarm_level;
  switch (stateNo) {
    case 0:
      state.value = "安全";
      break;
    case 1:
      state.value = "注意";
      break;
    case 2:
      state.value = "異常";
      break;
    case 3:
      state.value = "緊急";
      break;
  }

  stateInfo.value = TempHumData[TempHumData.length - 1].warninfo;
  now.value = TempHumData[TempHumData.length - 1].value;
  upper2.value = TempHumData[TempHumData.length - 1].ai_power_upperbound2;
  lower2.value = TempHumData[TempHumData.length - 1].ai_power_lowerbound2;
  upper1.value = TempHumData[TempHumData.length - 1].ai_power_upperbound1;
  lower1.value = TempHumData[TempHumData.length - 1].ai_power_lowerbound1;

  if (type[0] == 0) {
    if (now.value > upper2.value) {
      stateInfo.value = "溫度狀態嚴重高於範圍!!!";
    } else if (now.value < lower2.value) {
      stateInfo.value = "溫度狀態嚴重低於範圍!!!";
    } else if (now.value > upper1.value) {
      stateInfo.value = "溫度狀態高於動態範圍!";
    } else if (now.value < lower1.value) {
      stateInfo.value = "溫度狀態低於動態範圍!";
    } else {
      stateInfo.value = "溫度狀態正常";
    }
  } else if (type[0] == 1) {
    if (now.value > upper2.value) {
      stateInfo.value = "濕度狀態嚴重高於範圍!!!!";
    } else if (now.value < lower2.value) {
      stateInfo.value = "濕度狀態嚴重低於範圍!!!";
    } else if (now.value > upper1.value) {
      stateInfo.value = "濕度狀態高於動態範圍!";
    } else if (now.value < lower1.value) {
      stateInfo.value = "濕度狀態低於動態範圍!";
    } else {
      stateInfo.value = "濕度狀態正常";
    }
  }
}

function getGateways() {
  return [4, 7, 8, 9, 12, 13, 15, 16, 20, 22, 25];
}
const gateways = getGateways();
gateways.forEach((gateway) => {
  options.push({
    value: gateway,
    label: gateway,
  });
});
value.value = gateways[0];

function getSensors(value) {
  return [1297177, 1297184];
}
const sensors = getSensors();
sensors.forEach(function (sensor) {
  options1.push({
    value: sensor,
    label: sensor,
  });
});
value1.value = sensors[0];

function getTempHum(sensor) {
  return [
    {
      index_date: "00:00",
      value: 36,
      type: 1,
      alarm_level: 0,
      ai_power_upperbound1: 80 + Math.random() * 20,
      ai_power_lowerbound1: Math.random() * 20,
      ai_power_upperbound2: 80 + Math.random() * 20,
      ai_power_lowerbound2: Math.random() * 20,
    },
    {
      index_date: "00:00",
      value: 36,
      typy: 1,
      alarm_level: 0,
      ai_power_upperbound1: 80 + Math.random() * 20,
      ai_power_lowerbound1: Math.random() * 20,
      ai_power_upperbound2: 80 + Math.random() * 20,
      ai_power_lowerbound2: Math.random() * 20,
    },
    {
      index_date: "00:00",
      value: 36,
      typy: 1,
      alarm_level: 0,
      ai_power_upperbound1: 80 + Math.random() * 20,
      ai_power_lowerbound1: Math.random() * 20,
      ai_power_upperbound2: 80 + Math.random() * 20,
      ai_power_lowerbound2: Math.random() * 20,
    },
  ];
}
</script>

<style lang="scss" scoped>
.chart {
  display: inline-block !important;
  width: 100% !important;
  height: 100% !important;
}

.gateway {
  margin: 0 10px;
}
.card-header {
  font-size: 20px;
  margin: 10px 10px 30px 10px;
  display: flex;
  justify-content: center;
  color: rgb(87, 87, 87);
}
.box-card {
  margin: 92px 20px 10px 20px;
  height: 83%;
}

:deep .options {
  text-align: left;
  margin: 28px 10px !important;
}

.card-content {
  text-align: left;
  color: rgb(109, 108, 108);
  font-size: 16px;
  margin: 16px;
}

.line-chart {
  padding: 20px;
  margin: 0px 10px;
}
</style>