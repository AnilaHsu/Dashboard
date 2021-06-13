<template>
  <el-row>
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
  </el-row>

  <el-row>
    <el-col :span="16">
      <el-card class="line-chart" shadow="hover">
        <vue3-chart-js ref="lineChartRef" v-bind="{ ...lineChart }" />
      </el-card>
    </el-col>

    <el-col :span="8">
      <el-card class="box-card" shadow="hover">
        <div class="card-header">
          <span>濕度資訊</span>
        </div>
        <div class="card-content">
          <p>{{ tab }}狀態：{{ state }}</p>
          <p>狀態內容：</p>
          <p>{{ stateInfo }}</p>
          <p>目前{{ tab }}：{{ now }}</p>
          <p>注意上限：{{ upper2 }}</p>
          <p>注意下限：{{ lower2 }}</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);
import axios from "../utils/api";
import { getSSE } from "../utils/sse";

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
        borderColor: "#707070",
      },
      {
        label: "安全上限",
        data: [],
        fill: false,
        borderColor: "#689f38",
        borderDash: [3, 5],
      },
      {
        label: "安全下限",
        data: [],
        fill: false,
        borderColor: "#689f38",
        borderDash: [3, 5],
      },
      {
        label: "注意上限",
        data: [],
        fill: false,
        borderColor: "#ffb74d",
        borderDash: [6, 5],
      },
      {
        label: "注意下限",
        data: [],
        fill: false,
        borderColor: "#ffb74d",
        borderDash: [6, 5],
      },
      {
        label: "物理界線1",
        data: [],
        fill: false,
        borderColor: "#ff867c",
        borderDash: [11, 5],
      },
      {
        label: "物理界線2",
        data: [],
        fill: false,
        borderColor: "#ff867c",
        borderDash: [11, 5],
      },
    ],
  },
};

let tempHumDatas = [];

getGateways()
  .then(() => {
    getSensors(value.value)
      .then(() => {
        getTempHum(value.value, value1.value);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });

function updateData() {
  updateChart();
  updateInfo();
}

function updateChart() {
  lineChart.data.labels = tempHumDatas.map((data) => {
    console.log(data);
    return data.index_date;
  });
  lineChart.data.datasets[0].data = tempHumDatas.map((data) => {
    return data.value;
  });
  lineChart.data.datasets[1].data = tempHumDatas.map((data) => {
    return data.ai_power_upperbound1;
  });
  lineChart.data.datasets[2].data = tempHumDatas.map((data) => {
    return data.ai_power_lowerbound1;
  });
  lineChart.data.datasets[3].data = tempHumDatas.map((data) => {
    return data.ai_power_upperbound2;
  });
  lineChart.data.datasets[4].data = tempHumDatas.map((data) => {
    return data.ai_power_lowerbound2;
  });
  const type = tempHumDatas.map((data) => {
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
  const type = tempHumDatas.map((data) => {
    return data.type;
  });
  if (type[0] == 0) {
    tab.value = "溫度";
  } else if (type[0] == 1) {
    tab.value = "濕度";
  }
  const stateNo = tempHumDatas[tempHumDatas.length - 1].alarm_level;
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

  stateInfo.value = tempHumDatas[tempHumDatas.length - 1].warninfo;
  now.value = tempHumDatas[tempHumDatas.length - 1].value;
  upper2.value = tempHumDatas[tempHumDatas.length - 1].ai_power_upperbound2;
  lower2.value = tempHumDatas[tempHumDatas.length - 1].ai_power_lowerbound2;
  upper1.value = tempHumDatas[tempHumDatas.length - 1].ai_power_upperbound1;
  lower1.value = tempHumDatas[tempHumDatas.length - 1].ai_power_lowerbound1;

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
  return axios.post("/getGateways").then((gateways) => {
    gateways.forEach((gateway) => {
      options.push({
        value: gateway,
        label: gateway,
      });
    });
    value.value = gateways[0];
  });
}

function getSensors(gateway) {
  return axios.post(`/getSensors?gateway_no=${gateway}`).then((sensors) => {
    sensors.forEach(function (sensor) {
      options1.push({
        value: sensor,
        label: sensor,
      });
    });
    value1.value = sensors[0];
  });
}

function getTempHum(gateway, sensor) {
  const sse = getSSE("/thSSE");
  sse.addEventListener("open", (event) => {
    console.log("thSSE is open");
  });
  sse.addEventListener("message", (event) => {
    tempHumDatas = event.data;
  });
  sse.addEventListener("error", (event) => {
    if (event.readyState == EventSource.CLOSED) {
      console.log("thSSE is closed");
    }
  });
}
</script>

<style lang="scss" scoped>
.gateway {
  margin: 0 10px;
}
.card-header {
  font-size: 20px;
  margin: 10px 10px 40px 10px;
  display: flex;
  justify-content: center;
  color: rgb(87, 87, 87);
  font-style: bold;
}
.card-content {
  text-align: left;
  color: rgb(109, 108, 108);
  font-size: 16px;
  margin: 0px 70px;
}

.line-chart {
  height: 100%;
  margin: 10px;
}

.box-card {
  height: 100%;
  margin: 10px;
}

:deep .options {
  text-align: left;
  margin: 28px 10px !important;
}
</style>