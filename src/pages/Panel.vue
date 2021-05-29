<template>
  <div class="chart_option">
    <el-radio-group v-model="chartOption">
      <el-radio-button label="電力"></el-radio-button>
      <el-radio-button label="溫濕度"></el-radio-button>
    </el-radio-group>
  </div>

  <EpChart v-if="chartOption == '電力'" />

  <TempHumChart v-else-if="chartOption == '溫濕度'" />
</template> 

<script setup>
import { ref } from "vue";
import EpChart from "../components/EpChart.vue";
import TempHumChart from "../components/TempHumChart.vue";

const chartOption = ref("電力");
</script>


<style lang="scss" scoped>
:deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: rgba(122, 124, 128, 0.858) !important;
  border-color: rgba(122, 124, 128, 0.858) !important;
  box-shadow: -1px 0 0 0 rgba(96, 100, 107, 0.858) !important;
}
.chart_option{
  :deep .el-radio-button__inner {
    padding: 12px 16px;
  }
}

</style>