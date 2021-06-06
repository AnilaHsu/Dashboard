<template>
  <el-row>
    <el-col :span="18">
      <div class="chart">
        <div class="options">
          <span>
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
          </span>
          <span class="tab" style="margin-top: 20px">
            <el-radio-group
              class="tabs"
              v-model="tabOption"
              style="margin-bottom: 30px"
              @change="updateData"
            >
              <el-radio-button label="V">電壓</el-radio-button>
              <el-radio-button label="C">電流</el-radio-button>
              <el-radio-button label="P">功耗</el-radio-button>
            </el-radio-group>
          </span>
        </div>

        <el-card class="line_chart">
          <vue3-chart-js ref="lineChartRef" v-bind="{ ...lineChart }" />
        </el-card>
      </div>
    </el-col>

    <el-col :span="6">
      <el-card class="box-card" shadow="hover">
        <div class="card-header">
          <span>{{ tab }}資訊</span>
        </div>

        <div class="card-content">
          <p>{{ tab }}狀態：{{ state }}</p>
          <p>狀態內容：</p>
          <p>{{ stateInfo }}</p>
          <p>目前{{ tab }}：</p>
          <p>{{ now }}</p>
          <p>注意上限：</p>
          <p>{{ upper2 }}</p>

          <p v-if="tabOption !== 'C'">注意下限：</p>
          <p>{{ lower2 }}</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

// Data
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
const lineChartRef = ref(null);
const lineChart = {
  type: "line",
  data: {
    labels: ["1", "2", "3", "4"],
    datasets: [
      {
        label: "電壓",
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
        hidden: false,
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
        hidden: false,
      },
      {
        label: "物理界線",
        data: "",
        fill: false,
        hidden: false,
      },
    ],
  },
};
const electronicDatas = [];

// Setup
const probes = getProbes();
probes.forEach(function (probe) {
  options.push({
    value: probe,
    label: probe,
  });
});
value.value = probes[0];
const elec = getElec();
electronicDatas.push(...elec);

onMounted(() => {
  updateData();
});

onUnmounted(() => {
  clearInterval(timer);
});

const timer = setInterval(() => {
  const electronicDatas = [];
  const elec = getElec();
  electronicDatas.push(...elec);
  updateData();
}, 5000);

// Functions
function updateData() {
  updateChart();
  updateInfo();
}
function updateChart() {
  // update label
  lineChart.data.labels = electronicDatas.map((data) => {
    return data[tabOption.value].index_date;
  });
  updateLine();
  lineChartRef.value.update(250);
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
  if (tab !== "P") {
    lineChart.data.datasets[5].hidden = false;
    lineChart.data.datasets[5].data = Array(3).fill(10);
  } else {
    lineChart.data.datasets[5].hidden = true;
  }
}

function updateInfo() {
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
  stateInfo.value =
    electronicDatas[electronicDatas.length - 1][tabOption.value].warninfo;

  now.value =
    electronicDatas[electronicDatas.length - 1][tabOption.value].value;
  upper2.value =
    electronicDatas[electronicDatas.length - 1][
      tabOption.value
    ].ai_power_upperbound2;
  lower2.value =
    electronicDatas[electronicDatas.length - 1][
      tabOption.value
    ].ai_power_lowerbound2;
  upper1.value =
    electronicDatas[electronicDatas.length - 1][
      tabOption.value
    ].ai_power_upperbound1;
  lower2.value =
    electronicDatas[electronicDatas.length - 1][
      tabOption.value
    ].ai_power_lowerbound1;

  if (tabOption.value === "V") {
    if (now.value > upper2.value) {
      stateInfo.value = "電壓狀態嚴重高於限制，可能造成設備損壞";
    } else if (now.value < lower2.value) {
      stateInfo.value = "電壓狀態嚴重低於限制，可能造成設備損壞";
    } else if (now.value > upper1.value) {
      stateInfo.value = "電壓狀態高於限制!";
    } else if (now.value < lower1.value) {
      stateInfo.value = "電壓狀態低於限制!";
    } else {
      stateInfo.value = "電壓狀態正常";
    }
  } else if (tabOption.value === "C") {
    if (now.value > upper2.value) {
      stateInfo.value = "電流狀態嚴重高於限制";
    } else if (now.value > upper1.value) {
      stateInfo.value = "電流在未來30分鐘將有高機率超出範圍!";
    } else {
      stateInfo.value = "電流在在正常範圍";
    }
  } else if (tabOption.value === "P") {
    if (now.value > upper2.value) {
      stateInfo.value = "功率消耗異常，目前功率消耗高於預期";
    } else if (now.value < lower2.value) {
      stateInfo.value = "功率消耗異常，目前功率消耗低於預期";
    } else if (now.value > upper1.value) {
      stateInfo.value = "目前功率消耗高於預期";
    } else if (now.value < lower1.value) {
      stateInfo.value = "目前功率消耗低於預期";
    } else {
      stateInfo.value = "功率消耗正常";
    }
  }
}

// API
function getProbes() {
  return [4, 5, 6];
}
function getElec(probe) {
  return [
    {
      V: {
        index_date: "00:00",
        value: Math.random() * 100,
        alarm_level: 0,
        warninfo: "xxxx",
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_lowerbound1: Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
        ai_power_lowerbound2: Math.random() * 20,
      },
      C: {
        index_date: "00:00",
        value: Math.random() * 100,
        alarm_level: 0,
        warninfo: "xxxx",
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
      },
      P: {
        index_date: "00:00",
        value: Math.random() * 100,
        alarm_level: 0,
        warninfo: "xxxx",
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_lowerbound1: Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
        ai_power_lowerbound2: Math.random() * 20,
      },
    },
    {
      V: {
        index_date: "00:00",
        value: Math.random() * 100,
        alarm_level: 0,
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_lowerbound1: Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
        ai_power_lowerbound2: Math.random() * 20,
      },
      C: {
        index_date: "00:00",
        value: 100,
        alarm_level: 0,
        warninfo: "xxxx",
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
      },
      P: {
        index_date: "00:00",
        value: Math.random() * 100,
        alarm_level: 0,
        warninfo: "xxxx",
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_lowerbound1: Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
        ai_power_lowerbound2: Math.random() * 20,
      },
    },
    {
      V: {
        index_date: "00:00",
        value: Math.random() * 100,
        alarm_level: 0,
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_lowerbound1: Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
        ai_power_lowerbound2: Math.random() * 20,
      },
      C: {
        index_date: "00:00",
        value: Math.random() * 100,
        alarm_level: 0,
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
      },
      P: {
        index_date: "00:00",
        value: Math.random() * 100,
        alarm_level: 0,
        ai_power_upperbound1: 80 + Math.random() * 20,
        ai_power_lowerbound1: Math.random() * 20,
        ai_power_upperbound2: 80 + Math.random() * 20,
        ai_power_lowerbound2: Math.random() * 20,
      },
    },
  ];
}
</script>

<style lang='scss' scoped>
.chart {
  display: inline-block !important;
  width: 100% !important;
  height: 100% !important;
}
.tab {
  text-align: center;
  :deep .el-radio-button__inner {
    padding: 10px 20px;
    color: rgb(120, 120, 120);
  }
  :deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: hsla(180, 1%, 63%, 0.892) !important;
    border-color: hsla(180, 1%, 63%, 0.892) !important;
    box-shadow: -1px 0 0 0 hsla(180, 1%, 63%, 0.892) !important;
    color: #fff;
  }
}

.options {
  text-align: left;
}
.tabs {
  margin: 28px 10px;
}
.probe {
  margin: 0px 10px;
}
.card-header {
  font-size: 20px;
  margin: 10px 10px 30px 10px;
  display: flex;
  justify-content: center;
  color: rgb(87, 87, 87);
  font-style: bold;
}
.box-card {
  margin: 92px 20px 10px 20px;
  height: 83%;
}

.card-content {
  text-align: left;
  color: rgb(109, 108, 108);
  font-size: 16px;
  margin: 16px;
}

.col_bar {
  padding: 20px 40px 20px 20px;
  margin: 20px 10px;
}

.el-card__body {
  padding: 20px;
}
.line_chart {
  padding: 20px;
  margin: 0px 10px;
}
</style>