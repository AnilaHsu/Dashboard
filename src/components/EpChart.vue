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
          <p>目前{{ tab }}:</p>
          <p>{{ now }}</p>
          <p>最高{{ tab }}:</p>
          <p>{{ max }}</p>
          <p v-if="tabOption !== 'C'">最低{{ tab }}:</p>
          <p>{{ min }}</p>
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
const max = ref("");
const min = ref("");
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
        borderColor: "rgba(96, 100, 107, 0.858)",
        backgroundColor: "while",
      },
      {
        label: "上限",
        data: [],
        fill: false,
      },
      {
        label: "下限",
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
electronicDatas.push(elec);

onMounted(() => {
  updateData();
});

onUnmounted(() => {
  clearInterval(timer);
});

const timer = setInterval(() => {
  const elec = getElec();
  electronicDatas.push(elec);
  updateData();
}, 5000);

// Functions
function updateData() {
  updateChart();
  updateInfo();
}
function updateChart() {
  lineChart.data.labels = electronicDatas.map((data) => {
    return data[value.value][tabOption.value].time;
  });
  lineChart.data.datasets.forEach((dataset) => {
    dataset.data = [];
  });

  lineChart.data.datasets[0].data = electronicDatas.map((data) => {
    return data[value.value][tabOption.value].value;
  });
  lineChart.data.datasets[1].data = electronicDatas.map((data) => {
    return data[value.value][tabOption.value].upperlimit;
  });

  if (tabOption.value === "V") {
    lineChart.data.datasets[0].label = "電壓";
  } else if (tabOption.value === "C") {
    lineChart.data.datasets[0].label = "電流";
  } else {
    lineChart.data.datasets[0].label = "功耗";
  }

  if (tabOption.value !== "C") {
    const data = electronicDatas.map((data) => {
      return data[value.value][tabOption.value].lowerlimit;
    });
    if (lineChart.data.datasets[2] == null) {
      lineChart.data.datasets[2] = {
        label: "下限",
        data: data,
        fill: false,
      };
    } else {
      lineChart.data.datasets[2].data = data;
    }
  } else {
    lineChart.data.datasets.splice(2, 1);
  }

  lineChartRef.value.update(250);
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
    electronicDatas[electronicDatas.length - 1][value.value][tabOption.value]
      .warntype;
  switch (stateNo) {
    case 0:
      state.value = "安全";
      break;
    case 1:
      state.value = "警告";
      break;
    case 2:
      state.value = "異常";
      break;
    case 3:
      state.value = "緊急";
      break;
  }
  stateInfo.value =
    electronicDatas[electronicDatas.length - 1][value.value][
      tabOption.value
    ].warninfo;

  now.value =
    electronicDatas[electronicDatas.length - 1][value.value][
      tabOption.value
    ].value;
  max.value =
    electronicDatas[electronicDatas.length - 1][value.value][
      tabOption.value
    ].upperlimit;
  min.value =
    electronicDatas[electronicDatas.length - 1][value.value][
      tabOption.value
    ].lowerlimit;
}

// API
function getProbes() {
  return [4, 5, 6];
}
function getElec() {
  return {
    4: {
      V: {
        time: "00:00",
        value: Math.random() * 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
        lowerlimit: Math.random() * 20,
      },
      C: {
        time: "00:00",
        value: Math.random() * 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
      },
      P: {
        time: "00:00",
        value: Math.random() * 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
        lowerlimit: Math.random() * 20,
      },
    },
    5: {
      V: {
        time: "00:00",
        value: Math.random() * 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
        lowerlimit: Math.random() * 20,
      },
      C: {
        time: "00:00",
        value: 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
      },
      P: {
        time: "00:00",
        value: Math.random() * 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
        lowerlimit: Math.random() * 20,
      },
    },
    6: {
      V: {
        time: "00:00",
        value: Math.random() * 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
        lowerlimit: Math.random() * 20,
      },
      C: {
        time: "00:00",
        value: Math.random() * 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
      },
      P: {
        time: "00:00",
        value: Math.random() * 100,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 80 + Math.random() * 20,
        lowerlimit: Math.random() * 20,
      },
    },
  };
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
  color: rgb(109, 108, 108);
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