<template>
  <v-card
    class="mx-auto theme--dark"
    color="grey darken-3"
    elevation="4"
    max-width="250"
    outlined
    tile
  >
    <v-card-title class="headline mb-1">
      Headline 1
    </v-card-title>
    <v-card-text>
      <chart
        v-if="loaded"
        :chartdata="chartdata"
        :options="options"/>
    </v-card-text>
  </v-card>
</template>

<script>
import Chart from './Chart.vue';

export default {
  name: 'Card',
  components: { Chart },
  data: () => ({
    loaded: false,
    chartdata: null,
  }),
  async mounted() {
    this.loaded = false;
    try {
      const { userlist } = await fetch('localhost:4000/api/env_light');
      this.chartdata = userlist;
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>
