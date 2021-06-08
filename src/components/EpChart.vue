<template>
  <el-row>
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
  </el-row>
  <el-row>
    <el-col :span="16">
      <el-card class="line_chart" shadow="hover">
        <vue3-chart-js ref="lineChartRef" v-bind="{ ...lineChart }" />
      </el-card>
    </el-col>

    <el-col :span="8">
      <el-card class="box-card" shadow="hover">
        <div class="card-header">
          <span>{{ tab }}資訊</span>
        </div>

        <div class="card-content">
          <p>{{ tab }}狀態：{{ state }}</p>
          <p>狀態內容：</p>
          <p>{{ stateInfo }}</p>
          <p>目前{{ tab }}：{{ now }}</p>
          <p>注意上限：{{ upper2 }}</p>

          <p v-if="tabOption !== 'C'">注意下限：{{ lower2 }}</p>
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
const lineChartRef = ref(null);
const lineChartRefV = ref(null);
const lineChartRefC = ref(null);
const lineChartRefP = ref(null);
const lineChart = {
  type: "line",
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
        hidden: false,
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
        hidden: false,
        borderDash: [6, 5],
      },
      {
        label: "物理界線",
        data: "",
        hidden: false,
        borderColor: "#ff867c",
        borderDash: [11, 5],
      },
    ],
  },
};
const lineChartV = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "電壓",
        data: [],
        borderColor: "#5d99c6",
      },
    ],
  },
};
const lineChartC = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "電流",
        data: [],
        fill: true,
        borderColor: "#9e9e9e",
        backgroundColor: "rgba(69, 152, 204, 0.48)",
      },
    ],
  },
};
const lineChartP = {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "功耗",
        data: [],
        borderColor: "#9e9e9e",
        backgroundColor: "#5d99c6",
      },
    ],
  },
};
let electronicDatas = [];

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
electronicDatas = elec;

onMounted(() => {
  updateData();
});

onUnmounted(() => {
  clearInterval(timer);
});

const timer = setInterval(() => {
  const elec = getElec();
  electronicDatas = elec;
  updateData();
}, 5000);

// Functions
function updateData() {
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
  now.value = store.getters.now(tabOption.value);
  upper2.value = store.getters.upper2(tabOption.value);
  lower2.value = store.getters.lower2(tabOption.value);
  upper1.value = store.getters.upper1(tabOption.value);
  lower1.value = store.getters.lower1(tabOption.value);
  stateInfo.value = store.getters.stateInfo(tabOption.value);
}

// API
function getProbes() {
  return [4, 5, 6];
}
function getElec(probe) {
  const data = [
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
  store.commit("setElecData", data);
  return data;
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

.box-card {
  height: 100%;
  margin: 10px;
}
.line_chart {
  height: 100%;
  margin: 10px;
}

.line_chart_per {
  padding: 8px;
  margin: 24px 8px;
}
</style>