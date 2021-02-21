<template>
  <div class="chartElem">
    <div class="row">
      <highcharts :options="chartOptions"></highcharts>
    </div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import axios from 'axios';

export default {
  name: 'ChartView',
  components: { highcharts: Chart },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'spline',
        },
        title: {
          text: 'Environment - Light',
        },
        series: [{
          data: [],
          color: '#6fcd98',
        }],
      },
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    async fillData() {
      await axios.get('http://localhost:4000/api/db/env_light')
        .then((response) => {
          this.chartOptions = {
            series: [{
              data: response.data.map((m) => m.env_light),
            }],
          };
        });
    },
  },
};
</script>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
#colorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
}
.numberInput {
  width: 30px;
}
</style>
