<template>
  <v-card
    class="mx-auto theme--dark"
    color="grey darken-3"
    elevation="4"
    outlined
    tile
  >
    <v-card-subtitle>Env Light</v-card-subtitle>
    <v-card-title class="headline mb-1">
      Headline 1
    </v-card-title>
    <v-card-text>
      <chart :chart-data="datacollection"></chart>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import Chart from '../components/Chart.vue';

export default {
  name: 'DisplaySensor',
  components: {
    Chart,
  },
  data() {
    return {
      date: null,
      name: null,
      value: null,
    };
  },
  created() {
    // this.fetchData();
    this.fillData();
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      axios.get('/api/env_light')
        .then((response) => {
          const results = response.data.data;

          const dateresult = results.map((a) => a.date);
          const valueresult = results.map((a) => a.value);

          this.date = dateresult;
          this.value = valueresult;

          this.datacollection = {
            labels: this.date,
            datasets: [
              {
                label: 'Value',
                backgroundColor: '#f87979',
                data: this.value,
              },
            ],
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
