<template>
  <el-row>
    <el-col :span="18">
      <div class="chart">
        <div class="opions">
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
          <span class="tab" style="margin-top: 20px">
            <el-radio-group
              class="tabs"
              v-model="tabOption"
              style="margin-bottom: 30px"
              @change="updateData"
            >
              <el-radio-button label="T">溫度</el-radio-button>
              <el-radio-button label="H">濕度</el-radio-button>
            </el-radio-group>
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
          <p>目前{{ tab }}:</p>
          <p>{{ now }}</p>
          <p>最高{{ tab }}:</p>
          <p>{{ max }}</p>
          <p>最低{{ tab }}:</p>
          <p>{{ min }}</p>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row> </el-row>
</template>

<script setup>
import { reactive, ref, onMounted,onUnmounted } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

const tabOption = ref("T");
const options = reactive([]);
const value = ref("");
const value1 = ref("");
const options1 = reactive([]);
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
    labels: [],
    datasets: [
      {
        label: "",
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
const TempHumData = [];
const TempHum = getTempHum();
TempHumData.push(TempHum);

function updateData() {
  updateChart();
  updateInfo();
}

onMounted(() => {
  updateData();
});
onUnmounted(() => {
  clearInterval(timer)
})

const timer = setInterval(() => {
  const TempHum = getTempHum();
  TempHumData.push(TempHum);
  updateData();
}, 5000);

function updateChart() {
  lineChart.data.labels = TempHumData.map((data) => {
    console.log(data[value1.value][tabOption.value])
    console.log()
    return data[value1.value][tabOption.value].time;
  });
  lineChart.data.datasets[0].data = TempHumData.map((data) => {
    return data[value1.value][tabOption.value].value;
  });
  lineChart.data.datasets[1].data = TempHumData.map((data) => {
    return data[value1.value][tabOption.value].upperlimit;
  });
  lineChart.data.datasets[2].data = TempHumData.map((data) => {
    return data[value1.value][tabOption.value].lowerlimit;
  });
  if (tabOption.value === "T") {
    lineChart.data.datasets[0].label = "溫度";
  } else if (tabOption.value === "H") {
    lineChart.data.datasets[0].label = "濕度";
  }
  lineChartRef.value.update(250);
}
function updateInfo() {
  if (tabOption.value === "T") {
    tab.value = "溫度";
  } else if (tabOption.value === "C") {
    tab.value = "濕度";
  }
  const stateNo =
    TempHumData[TempHumData.length - 1][value1.value][tabOption.value]
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
    TempHumData[TempHumData.length - 1][value1.value][
      tabOption.value
    ].warninfo;
  now.value =
    TempHumData[TempHumData.length - 1][value1.value][
      tabOption.value
    ].value;
  max.value =
    TempHumData[TempHumData.length - 1][value1.value][
      tabOption.value
    ].upperlimit;
  min.value =
    TempHumData[TempHumData.length - 1][value1.value][
      tabOption.value
    ].lowerlimit;
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

function getTempHum(value) {
  return {
    1297177: {
      T: {
        time: "00:00",
        value: 30,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 40,
        lowerlimit: 20,
      },
      H: {
        time: "00:00",
        value: 30,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 30,
        lowerlimit: 12,
      },
    },
    1297184: {
      T: {
        time: "00:00",
        value: 30,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 40,
        lowerlimit: 20,
      },
      H: {
        time: "00:00",
        value: 30,
        warntype: 0,
        warninfo: "xxxx",
        upperlimit: 30,
        lowerlimit: 12,
      },
    },
  };
}
</script>


<style lang="scss" scoped>
.chart {
  display: inline-block !important;
  width: 100% !important;
  height: 100% !important;
}

.tab {
  text-align: center;
  :deep .el-radio-button__inner {
    padding: 10px 20px;
    color: rgb(136, 136, 136);
  }
  :deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: hsla(180, 1%, 63%, 0.892) !important;
    border-color: hsla(180, 1%, 63%, 0.892) !important;
    box-shadow: -1px 0 0 0 hsla(180, 1%, 63%, 0.892) !important;
    color: #fff;
  }
}

.gateway {
  margin: 0 10px;
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
.options {
  text-align: left;
}
.tabs {
  margin: 28px 10px;
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