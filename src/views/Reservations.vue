<template>
   <v-container>
      <v-dialog
        v-if="eventWindow"
        v-model="eventWindow"
        max-width="600px"
        @keydown.esc="closeAndReload"
        persistent
      > 
        <Event
          :eventsProp="events"
          @closeAndReload="closeAndReload()"
        />
      </v-dialog>
    <v-card>
      <Calendar/>
    </v-card>
   </v-container> 
</template>

<script>
import Event from '../components/Event.vue';
import Calendar from '../components/Calendar.vue';
import rules from '@/utils/helpers/rules';
import { mapActions } from 'vuex';

export default{
  name: 'Reservations',
  components: {
    Event,
    Calendar
  },
  data(){ 
    return {
      eventWindow: false,
      events: [],
      event: {},
      rules: rules,
  }},
  mounted () {
    console.log('mounted');
    this.fetchEvents();
    
  },
  methods: {
    ...mapActions("events", ["fetchEvents"]),
    closeAndReload() {
      this.eventWindow = false;
      this.fetchEvents();
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
  }
}

</script>

<style>
</style>