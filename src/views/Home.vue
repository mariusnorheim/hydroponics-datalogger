<template>
  <div>
    <div class="page-header">
      <h3>Dashboard</h3>
    </div>
    <v-row no-gutters>
      <v-col
        cols="12"
        md="2"
      >
        <v-card
          class="mx-auto theme--dark"
          color="grey darken-3"
          elevation="4"
          max-width="250"
          outlined
          tile
        >
          <v-card-subtitle>Env Light</v-card-subtitle>
          <v-card-title class="headline mb-1">
            28
          </v-card-title>
          <v-card-text>
            Duh hello!
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import Chart from '../components/Chart.vue';

export default {
  name: 'Home',
  components: {
    // Chart,
  },
};
</script>
