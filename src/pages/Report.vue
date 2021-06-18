<template>
  <el-row>

    <el-col>
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
  background-color: rgba(68, 68, 68, 0.858) !important;
  border-color: rgba(122, 124, 128, 0.858) !important;
  box-shadow: -1px 0 0 0 rgba(96, 100, 107, 0.858) !important;
  

  
}
.chart_option {
  :deep .el-radio-button__inner {
    padding: 12px 16px;
    border-radius: 20px 20px 20px 20px;
  }
}

.download-btn {
  display: inline-block;
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