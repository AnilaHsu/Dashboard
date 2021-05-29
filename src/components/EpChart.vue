<template>
  <el-row>
    <el-col :span="18">
      <div class="chart">
        <div class="period" style="margin-top: 20px">
          <el-radio-group
            v-model="periodOption"
            style="margin-bottom: 30px"
            @change="changePeriod"
          >
            <el-radio-button label="0">今日</el-radio-button>
            <el-radio-button label="1">過去一週</el-radio-button>
            <el-radio-button label="2">過去一個月</el-radio-button>
            <el-radio-button label="3">過去三個月</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <vue3-chart-js ref="lineChartRef" v-bind="{ ...lineChart }" />
        </div>
      </div>
    </el-col>

    <el-col :span="6">
      <div class="data_option">
        <el-select
          class="probe"
          v-model="value"
          clearable
          placeholder="請選擇 probe "
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </el-col>
  </el-row>

  <el-row class="row_info">
    <el-col :span="8" class="col_info">
      <el-card class="box-card" shadow="hover">
        <div class="card-header">
          <span>電力資訊</span>
        </div>
        <div class="card-content">
          <pre><p>電壓狀態： &emsp;{{ infoV }} </p></pre>
          <pre><p>目前電壓： &emsp;{{ nowV }}  V</p></pre>
          <pre><p>目前電流： &emsp;{{ nowCur }}  A</p></pre>
          <pre><p>累積瓦數： &emsp;{{ total_watts }}  W</p></pre>
        </div>
      </el-card>
    </el-col>

    <el-col :span="15" class="col_bar">
      <el-card class="box-card" shadow="hover">
        <div class="bar" style="max-width: 4500px">
          <vue3-chart-js ref="barChartRef" v-bind="{ ...barChart }" />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

const periodOption = ref("今日");

const lineChart = {
  type: "line",
  data: {
    datasets: [
      {
        label: "電壓",
        data: [65, 59, 80, 81, 56, 55, 40, 60, 40, 30, 22, 73],
        fill: false,
        borderColor: "rgba(96, 100, 107, 0.858)",
        backgroundColor: "while",
      },
      {
        label: "電流",
        data: [70, 25, 10, 90, 5, 60, 30, 80, 30, 50, 120, 21],
        fill: false,
        borderColor: "rgba(38, 145, 227, 0.742)",
        tension: 0.5,
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


const options = reactive([
  {
    value: "4",
    label: "4",
  },
  {
    value: "7",
    label: "7",
  },
  {
    value: "8",
    label: "8",
  },
]);

const value = ref("");

const lineChartRef = ref(null);
const barChartRef = ref(null);

function changePeriod(value) {
  lineChart.data.labels = generateLabels(value);
  barChart.data.labels = generateLabels(value);
  lineChartRef.value.update(750);
  barChartRef.value.update(750)
}

function generateLabels(period) {
  if (period == 0) {
    const currentHour = new Date().getHours();
    var temp = currentHour;
    const list = [];
    for (var i = 0; i < 24; i++) {
      list.push(temp.toString());
      temp--;
      if (temp == 0) {
        temp = 24;
      }
    }
    return list.reverse();
  } else if (period == 1) {
    const time = new Date();
    var month = time.getMonth();
    var date = time.getDate();
    const list = [];
    const bigMonth = [0, 2, 4, 6, 7, 9, 11];
    const smallMonth = [3, 5, 8, 10];
    for (var i = 0; i < 7; i++) {
      list.push(`${month + 1}/${date}`);
      date--;
      if (date == 0) {
        if (bigMonth.includes(month - 1)) {
          date = 31;
        } else if (smallMonth.includes(month - 1)) {
          date = 30;
        } else {
          date = 28;
        }
        month--;
      }
    }
    return list.reverse();
  } else if (period == 2) {
    const time = new Date();
    var month = time.getMonth();
    var date = time.getDate();
    const list = [];
    const bigMonth = [0, 2, 4, 6, 7, 9, 11];
    const smallMonth = [3, 5, 8, 10];
    for (var i = 0; i < 30; i++) {
      list.push(`${month + 1}/${date}`);
      date--;
      if (date == 0) {
        if (bigMonth.includes(month - 1)) {
          date = 31;
        } else if (smallMonth.includes(month - 1)) {
          date = 30;
        } else {
          date = 28;
        }
        month--;
      }
    }
    return list.reverse();
  } else if (period == 3) {
    const time = new Date();
    var month = time.getMonth();
    var date = time.getDate();
    const list = [];
    const bigMonth = [0, 2, 4, 6, 7, 9, 11];
    const smallMonth = [3, 5, 8, 10];
    for (var i = 0; i < 12; i++) {
      list.push(`${month + 1}/${date}`);
      date -= 7;
      if (date <= 0) {
        if (bigMonth.includes(month - 1)) {
          date += 31;
        } else if (smallMonth.includes(month - 1)) {
          date += 30;
        } else {
          date += 28;
        }
        month--;
      }
    }
    return list.reverse();
  }
}
const infoV = ref("正常");
const nowV = ref(110);
const nowCur = ref(27);
const total_watts = ref(3000);

const barChart = {
  type: "bar",
  options: {
    min: 0,
    max: 100,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function (value) {
            return `${value}`;
          },
        },
      },
    },
  },
  data: {
    labels: ["1", "2", "3", "4"],
    datasets: [
      {
        label: "累計瓦數",
        backgroundColor: ["#FF9797", "#6FB7B7", "#84C1FF	", "#bdc3c7"],
        data: [40, 20, 50, 10],
      },
    ],
  },
};
</script>

<style lang='scss' scoped>
.chart {
  display: inline-block !important;
  width: 100% !important;
  height: 100% !important;
}
.period {
  text-align: center;
  :deep .el-radio-button__inner {
    padding: 9px 16px;
    color: rgb(120, 120, 120);
  }
  :deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: hsla(180, 1%, 63%, 0.892) !important;
    border-color: hsla(180, 1%, 63%, 0.892) !important;
    box-shadow: -1px 0 0 0 hsla(180, 1%, 63%, 0.892) !important;
    color: #fff;
  }
}
.data_option {
  margin: 100px 10px;
  text-align: center;
}
.probe {
  margin: 8px 0px;
}
.card-header {
  display: flex;
  color: rgb(109, 108, 108);
}
.box-card {
  width: 100%;
  height: 90%;
}
.col_info {
  margin: 10px 3px;
  display: inline-flex;
  justify-self: center;
}
.card-content {
  text-align: left;
  color: rgb(109, 108, 108);
  font-size: 16px;
  padding: 20px 80px;
}
.row_info {
  padding: 0 30px;
}
.col_bar {
  padding: 10px 20px;
}
.bar{
  padding: 0 0 20px 0;
  text-align: center;
  height: 150px;
  width: 400px;
}
.el-card__body{
  padding:20px;
}
</style>