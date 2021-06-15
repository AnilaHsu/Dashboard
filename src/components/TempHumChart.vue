<template>
  <el-row>
    <div class="options">
      <span class="data_option">
        <el-select
          class="gateway"
          v-model="value"
          clearable
          placeholder="請選擇 gateway"
          @change="getSensors"
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
      <el-card class="line-chart" shadow="always">
        <vue3-chart-js ref="lineChartRef" v-bind="{ ...lineChart }" />
      </el-card>
    </el-col>

    <el-col :span="8">
      <el-card class="box-card" shadow="always">
        <!-- <div class="card-header">
          <span>{{ tab }}資訊</span>
        </div> -->

        <div class="card-content">
          <p class="content-label">狀態</p>
          <p class="content-info">{{ state }}</p>
          <p class="content-label">狀態內容</p>
          <p class="content-info">{{ stateInfo }}</p>
        </div>
      </el-card>
      <el-card class="box-card" shadow="always">
        <div class="card-content">
          <p class="content-label">當前值</p>
          <p class="content-info">{{ now }}</p>
          <p class="content-label">上限（注意）</p>
          <p class="content-info">{{ upper2 }}</p>
          <p class="content-label">下限（注意）</p>
          <p class="content-info">{{ lower2 }}</p>
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
      // {
      //   label: "物理界線1",
      //   data: [],
      //   fill: false,
      //   borderColor: "#ff867c",
      //   borderDash: [11, 5],
      // },
      // {
      //   label: "物理界線2",
      //   data: [],
      //   fill: false,
      //   borderColor: "#ff867c",
      //   borderDash: [11, 5],
      // },
    ],
  },
};
let tempHumDatas = [];

getGateways();

onUnmounted(() => {
  if (sse !== undefined && sse.readyState !== EventSource.CLOSED) sse.close();
});
function updateData() {
  getTempHum(value1.value);
}

function updateChart() {
  lineChart.data.labels = tempHumDatas.map((data) => {
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
  // const type = tempHumDatas.map((data) => {
  //   return data.type;
  // });
  // if (type[0] == 0) {
  //   lineChart.data.datasets[0].label = "溫度";
  //   lineChart.data.datasets[5].data = Array(3).fill(10);
  //   lineChart.data.datasets[6].data = Array(3).fill(38);
  // } else if (type[0] == 1) {
  //   lineChart.data.datasets[0].label = "濕度";
  //   lineChart.data.datasets[6].data = Array(3).fill(30);
  //   lineChart.data.datasets[5].data = Array(3).fill(100);
  // }
  lineChartRef.value.update(250);
}

function updateInfo() {
  const type = tempHumDatas.map((data) => {
    return data.type;
  });
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
  now.value = tempHumDatas[tempHumDatas.length - 1].value.toFixed(2);
  upper2.value =
    tempHumDatas[tempHumDatas.length - 1].ai_power_upperbound2.toFixed(2);
  lower2.value =
    tempHumDatas[tempHumDatas.length - 1].ai_power_lowerbound2.toFixed(2);
  upper1.value =
    tempHumDatas[tempHumDatas.length - 1].ai_power_upperbound1.toFixed(2);
  lower1.value =
    tempHumDatas[tempHumDatas.length - 1].ai_power_lowerbound1.toFixed(2);

  if (type[tempHumDatas.length - 1] == 65538) {
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
  } else if (type[tempHumDatas.length - 1] == 65537) {
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
  return axios
    .get("/getGateways")
    .then((gateways) => {
      gateways.forEach((gateway) => {
        options.push({
          value: gateway,
          label: gateway,
        });
      });
      value.value = gateways[0];
      getSensors(value.value);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getSensors(gateway) {
  return axios
    .get(`/getSensors?gateway_no=${gateway}`)
    .then((sensors) => {
      sensors.forEach(function (sensor) {
        options1.push({
          value: sensor,
          label: sensor,
        });
      });
      value1.value = sensors[0];
      updateData();
    })
    .catch((error) => {
      console.log(error);
    });
}
let sse;
function getTempHum(sensor) {
  if (sse !== undefined && sse.readyState !== EventSource.CLOSED) sse.close();
  sse = getSSE(`/thSSE?sensor_no=${sensor}`);
  sse.addEventListener("open", (event) => {
    console.log("thSSE is open");
  });
  sse.addEventListener("message", (event) => {
    tempHumDatas = JSON.parse(event.data).filter((data) => {
      return data.ai_power_upperbound2 !== 0;
    });
    console.log(tempHumDatas);
    updateChart();
    updateInfo();
  });
  sse.addEventListener("error", (event) => {
    if (event.readyState == EventSource.CLOSED) {
      console.log("thSSE is EventSource.CLOSED");
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
  color: rgba(68, 68, 68, 0.858);
  font-size: 16px;
  padding: 8px;
  .content-label {
    font-size: 14px;
    font-style: normal;
    margin: 0 0 4px 0;
    color: rgba(0, 0, 0, 0.35);
  }
  .content-info {
    font-size: 24px;
    font-style: bold;
    color: black;
    margin: 0 0 12px 0;
  }
  .content-info:last-child {
    margin: 0;
  }
}

.line-chart {
  margin: 10px;
  padding: 16px;
}

.box-card {
  margin: 10px;
}

:deep .options {
  text-align: left;
  margin: 28px 10px !important;
}
</style>