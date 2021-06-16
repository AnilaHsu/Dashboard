<template>
  <el-row>
    <div class="options">
      <span class="choose"> probe</span>
      <el-select
        class="probe"
        v-model="value"
        clearable
        placeholder="請選擇 probe"
        @change="updateData"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="tab" style="margin-top: 20px">
        <el-radio-group class="tabs" v-model="tabOption" @change="updateUI">
          <el-radio-button label="V">電壓</el-radio-button>
          <el-radio-button label="C">電流</el-radio-button>
          <el-radio-button label="P">功耗</el-radio-button>
        </el-radio-group>
      </span>
    </div>
    <date-card :date="date" />
  </el-row>
  <el-row>
    <el-col :span="16">
      <el-card class="line_chart" shadow="always">
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
          <div v-if="tabOption !== 'C'">
            <p class="content-label">下限（注意）</p>
            <p class="content-info">{{ lower2 }}</p>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="8">
      <el-card class="line_chart_per">
        <vue3-chart-js ref="lineChartRefV" v-bind="{ ...lineChartV }" />
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="line_chart_per">
        <vue3-chart-js ref="lineChartRefC" v-bind="{ ...lineChartC }" />
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="line_chart_per">
        <vue3-chart-js ref="lineChartRefP" v-bind="{ ...lineChartP }" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
import { useStore } from "vuex";
import axios from "../utils/api";
import { baseURL } from "../utils/constants";
import DateCard from "./DateCard.vue"

Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

// Data
const store = useStore();
const tabOption = ref("V");
const options = reactive([]);
const value = ref("");
const tab = ref("");
const state = ref("");
const stateInfo = ref("");
const now = ref("");
const upper1 = ref("");
const lower1 = ref("");
const upper2 = ref("");
const lower2 = ref("");
const date = ref("");
const lineChartRef = ref(null);
const lineChartRefV = ref(null);
const lineChartRefC = ref(null);
const lineChartRefP = ref(null);
const lineChart = {
  type: "line",
  options: {
    radius: 0,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "時間",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "電壓值 (V)",
        },
      },
    },
  },
  data: {
    labels: ["1", "2", "3", "4"],
    datasets: [
      {
        label: "電壓",
        data: [],
        fill: false,
        borderColor: "#707070",
      },
      {
        label: "安全範圍",
        data: [],
        fill: false,
        borderColor: "#689f38",
        borderDash: [3, 5],
      },
      {
        label: "安全範圍",
        data: [],
        fill: false,
        borderColor: "#689f38",
        hidden: false,
        borderDash: [3, 5],
      },
      {
        label: "警戒範圍",
        data: [],
        fill: false,
        borderColor: "#ffb74d",
        borderDash: [6, 5],
      },
      {
        label: "警戒範圍",
        data: [],
        fill: false,
        borderColor: "#ffb74d",
        hidden: false,
        borderDash: [6, 5],
      },
    ],
  },
};
const lineChartV = {
  type: "line",
  options: {
    radius: 0,
  },
  data: {
    labels: [],
    datasets: [
      {
        label: "電壓（V）",
        data: [],
        borderColor: "#5d99c6",
      },
    ],
  },
};
const lineChartC = {
  type: "line",
  options: {
    radius: 0,
  },
  data: {
    labels: [],
    datasets: [
      {
        label: "電流（A）",
        data: [],
        borderColor: "#9e9e9e",
        backgroundColor: "rgba(69, 152, 204, 0.48)",
      },
    ],
  },
};
const lineChartP = {
  type: "line",

  data: {
    labels: [],
    datasets: [
      {
        label: "功耗（kW）",
        data: [],
        borderColor: "#9e9e9e",
        backgroundColor: "#5d99c6",
      },
    ],
  },
};
let electronicDatas = [];

// Setup
getProbes()
  .then(() => {
    updateData();
  })
  .catch((error) => {
    console.log(error);
  });

onUnmounted(() => {
  if (
    eventSource !== undefined &&
    eventSource.readyState !== EventSource.CLOSED
  )
    eventSource.close();
});
// Functions
function updateData() {
  getElec(value.value);
}
function updateUI() {
  updateChart();
  updateInfo();
}
function updateChart() {
  // update label
  const labels = electronicDatas.map((data) => {
    return data[tabOption.value].index_date;
  });
  lineChart.data.labels = labels;
  lineChartV.data.labels = labels;
  lineChartC.data.labels = labels;
  lineChartP.data.labels = labels;

  switch (tabOption.value) {
    case "V":
      lineChart.data.datasets[0].label = "電壓";
      lineChart.options.scales.y.title.text = "電壓（V）";
      break;
    case "C":
      lineChart.data.datasets[0].label = "電流";
      lineChart.options.scales.y.title.text = "電流（A）";
      break;
    case "P":
      lineChart.data.datasets[0].label = "功耗";
      lineChart.options.scales.y.title.text = "功耗（kW）";
      break;
  }

  lineChartV.data.datasets[0].data = electronicDatas.map((data) => {
    return data["V"].value;
  });
  lineChartC.data.datasets[0].data = electronicDatas.map((data) => {
    return data["C"].value;
  });
  lineChartP.data.datasets[0].data = electronicDatas.map((data) => {
    return data["P"].value;
  });
  updateLine();
  lineChartRef.value.update(250);
  lineChartRefV.value.update(250);
  lineChartRefC.value.update(250);
  lineChartRefP.value.update(250);
}
function updateLine() {
  const tab = tabOption.value;
  lineChart.data.datasets[0].data = electronicDatas.map((data) => {
    return data[tabOption.value].value;
  });
  lineChart.data.datasets[1].data = electronicDatas.map((data) => {
    return data[tabOption.value].ai_power_upperbound1;
  });
  if (tab !== "C") {
    lineChart.data.datasets[2].hidden = false;
    lineChart.data.datasets[2].data = electronicDatas.map((data) => {
      return data[tabOption.value].ai_power_lowerbound1;
    });
  } else {
    lineChart.data.datasets[2].hidden = true;
  }
  lineChart.data.datasets[3].data = electronicDatas.map((data) => {
    return data[tabOption.value].ai_power_upperbound2;
  });
  if (tab !== "C") {
    lineChart.data.datasets[4].hidden = false;
    lineChart.data.datasets[4].data = electronicDatas.map((data) => {
      return data[tabOption.value].ai_power_lowerbound2;
    });
  } else {
    lineChart.data.datasets[4].hidden = true;
  }
  // if (tab !== "P") {
  //   lineChart.data.datasets[5].hidden = false;
  //   lineChart.data.datasets[5].data = Array(1440).fill(10);
  // } else {
  //   lineChart.data.datasets[5].hidden = true;
  // }
}

function updateInfo() {
  date.value =
    electronicDatas[electronicDatas.length - 1][tabOption.value].date;
  console.log(electronicDatas[electronicDatas.length - 1]);
  if (tabOption.value === "V") {
    tab.value = "電壓";
  } else if (tabOption.value === "C") {
    tab.value = "電流";
  } else if (tabOption.value === "P") {
    tab.value = "功耗";
  }
  const stateNo =
    electronicDatas[electronicDatas.length - 1][tabOption.value].alarm_level;
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
  now.value = store.getters
    .now(tabOption.value, electronicDatas.length - 1)
    .toFixed(2);
  upper2.value = store.getters
    .upper2(tabOption.value, electronicDatas.length - 1)
    .toFixed(2);
  upper1.value = store.getters
    .upper1(tabOption.value, electronicDatas.length - 1)
    .toFixed(2);
  if (tabOption.value !== "C") {
    lower2.value = store.getters
      .lower2(tabOption.value, electronicDatas.length - 1)
      .toFixed(2);
    lower1.value = store.getters
      .lower1(tabOption.value, electronicDatas.length - 1)
      .toFixed(2);
  }
  stateInfo.value = store.getters.lastStateInfo(tabOption.value);
}

// API
function getProbes() {
  return axios.get("/getProbes").then((probes) => {
    probes.forEach((probe) => {
      options.push({
        value: probe,
        label: probe,
      });
    });
    value.value = probes[0];
    return probes;
  });
}
let eventSource;
function getElec(probe) {
  if (
    eventSource !== undefined &&
    eventSource.readyState !== EventSource.CLOSED
  )
    eventSource.close();
  eventSource = new EventSource(baseURL + `/electSSE?probe_no=${probe}`);
  eventSource.addEventListener("open", (event) => {
    console.log("electSSE is open");
  });
  eventSource.addEventListener("message", (event) => {
    electronicDatas = JSON.parse(event.data).filter((data) => {
      return data.P.ai_power_upperbound2 !== 0;
    });
    store.commit("setElecData", electronicDatas);
    updateUI();
  });
  eventSource.addEventListener("error", (event) => {
    if (event.readyState == EventSource.CLOSED) {
      console.log("electSSE is stop");
    }
  });
}
</script>

<style lang='scss' scoped>
.tab {
  text-align: center;
  :deep .el-radio-button__inner {
    padding: 10px 20px;
    color: rgb(120, 120, 120);
  }
  :deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: rgba(68, 68, 68, 0.858) !important;
    border-color: hsla(180, 1%, 63%, 0.892) !important;
    box-shadow: -1px 0 0 0 hsla(180, 1%, 63%, 0.892) !important;
    color: #fff;
  }
}

.options {
  text-align: left;
  margin: 16px auto 0 0;
}
.tabs {
  margin: 0 10px 0 0;
}
.probe {
  margin: 0px 10px;
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
    font-size: 22px;
    font-style: bold;
    color: black;
    margin: 0 0 12px 0;
  }
  .content-info:last-child {
    margin: 0;
  }
}

.box-card {
  margin: 10px;
}
.line_chart {
  margin-top: 10px;
}

.line_chart_per {
  padding: 8px;
  margin: 24px 8px;
  &:first-child {
    margin-left: 0;
  }
}
.choose {
  color: rgba(65, 65, 65, 0.87);
  font-weight: bold;
  margin: 0 2px 0 0px;
  font-size: 16px;
}
:deep .el-input__inner {
  width: 120px;
}
</style>