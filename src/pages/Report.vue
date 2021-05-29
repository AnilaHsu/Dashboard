<template>
  <el-row>
    <el-col :span="20">
      <div class="chart_option">
        <el-radio-group v-model="chartOption">
          <el-radio-button label="電力"></el-radio-button>
          <el-radio-button label="溫濕度"></el-radio-button>
        </el-radio-group>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="download-btn">
        <el-button class="download-pdf">pdf</el-button>
        <el-button class="download-csv">csv</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue";

const chartOption = ref("電力");
</script>


<style lang="scss" socped>
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: rgba(122, 124, 128, 0.858) !important;
  border-color: rgba(122, 124, 128, 0.858) !important;
  box-shadow: -1px 0 0 0 rgba(96, 100, 107, 0.858) !important;
}
.chart_option {
  .el-radio-button__inner {
    padding: 12px 16px;
  }
}

.download-btn {
  display: inline-block;
  float: right;
  margin: 0 10px;
}

.el-button {
  color: rgb(120, 120, 120);
  font-size: 16px;
  border-radius: 8px;
  padding: 10px 12px;
  font-weight: 600;

  &:focus,
  &:hover {
    color: #f6f8fb;
    border-color: rgb(165, 166, 168);
    background-color: rgb(165, 166, 168);
  }
}
</style>