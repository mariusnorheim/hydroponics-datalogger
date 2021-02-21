<template>
  <div>
    <div class="page-header">
      <h3>Dashboard</h3>
    </div>
    <v-row no-gutters>
      <v-col
        cols="1"
        md="12"
      >
        <ChartView />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ChartView from '@/components/ChartView.vue';

export default {
  name: 'Home',
  components: {
    ChartView,
  },
};
</script>
