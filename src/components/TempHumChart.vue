<template>
  <el-row>
    <el-col :span="18">
      <div class="chart">
        <div class="preiod" style="margin-top: 20px">
          <el-radio-group
            v-model="preiodOption"
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
          <vue3-chart-js ref="chartRef" v-bind="{ ...lineChart }" />
        </div>
      </div>
    </el-col>

    <el-col :span="6">
      <div class="data_option">
        <el-select
          class="gateway"
          v-model="value"
          clearable
          placeholder="請選擇 gateway "
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select v-model="value1" clearable placeholder="請選擇 sensor ">
          <el-option
            v-for="item in options1"
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
    <el-col :span="9" class="col_info">
      <el-card class="box-card" shadow="hover">
        <div class="card-header">
          <span>溫度資訊</span>
        </div>
        <div class="card-content">
          <pre><p>溫度狀態：{{ infoTemp }}</p></pre>
          <pre><p>目前溫度：{{ nowTemp }} ˚C</p></pre>
          <pre><p>最高溫度：{{ maxTemp }} ˚C</p></pre>
          <pre><p>最低溫度：{{ minTemp }} ˚C</p></pre>
        </div>
      </el-card>
    </el-col>
    <el-col :span="9" class="col_info">
      <el-card class="box-card" shadow="hover">
        <div class="card-header">
          <span>濕度資訊</span>
        </div>
        <div class="card-content">
          <pre><p>濕度狀態：{{ infoHum }}</p></pre>
          <pre><p>目前濕度：{{ nowHum }} ％</p></pre>
          <pre><p>最高濕度：{{ maxHum }} ％</p></pre>
          <pre><p>最低濕度：{{ minHum }} ％</p></pre>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

const preiodOption = ref("今日");

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
    value: "5",
    label: "5",
  },
  {
    value: "6",
    label: "6",
  },
]);

const value = ref("");
const value1 = ref("");
const options1 = reactive([
  {
    value: "1297177",
    label: " 1297177",
  },
  {
    value: "1297184",
    label: "1297184",
  },
]);

const chartRef = ref(null);

function changePeriod(value) {
  lineChart.data.labels = generateLabels(value);
  chartRef.value.update(750);
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
const nowTemp = ref(25)
const maxTemp = ref(36)
const minTemp = ref(16)
const nowHum = ref(15)
const maxHum = ref(20)
const minHum = ref(10)
const infoTemp = ref ("正常")
const infoHum = ref ("正常")
</script>


<style lang="scss" scoped>
.chart {
  display: inline-block !important;
  width: 100% !important;
  height: 100% !important;
}

.preiod {
  text-align: center;
  :deep .el-radio-button__inner {
    padding: 9px 16px;
    color: rgb(136, 136, 136);
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
.gateway {
  margin: 8px 0px;
}
.card-header {
  display: flex;
  color: rgb(109, 108, 108);
  font-size: 16px;
}
.box-card {
  width: 100%;
  height: 90%;
}
.col_info {
  margin: 10px 3px;
  display: inline-flex;
  justify-self: center;
  padding: 0 8px;

}
.card-content {
  text-align: left;
  color: rgb(109, 108, 108);
  font-size: 16px;
  padding: 0 0 10px 120px;
}
.row_info{
  padding: 0 30px;
}
</style>