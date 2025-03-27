<template>
    <v-container>
      <v-card>
       <FullCalendar 
       :options="calendarOptions" 
       :events="events"></FullCalendar>
      </v-card>
      <v-dialog
        v-if="window"
        v-model="window"
        max-width="600px"
        @keydown.esc="closeAndReload"
        persistent
      > 
        <Event
          :eventProp="localEvent"
          :isEditProp="isEdit"
          @closeAndReload="closeAndReload()"
        />
      </v-dialog>
      <v-snackbar v-model="askSave" centered>
      {{ message }}
      <v-btn color="white" text @click="toggleSaveEvent()">Yes</v-btn>
      <v-btn color="white" text @click="closeAndReload()">No</v-btn>
    </v-snackbar>
    </v-container> 
 </template>
 
<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Event from './Event.vue';
import rules from '@/utils/helpers/rules';
import { mapActions } from 'vuex';
import httpClient from '@/api/httpClient';
 
 export default{
   name: 'Calendar',
   components: {
     FullCalendar,
     Event
   },
   data(){
    return{
      isEdit: false,
      window: false,
      events: [],
      menuStart: false,
      menuEnd: false,
      isFormValid: false,
      start: '',
      end: '',
      allDay: false,
      rules: rules,
      calendarOptions: {},
      askSave: false,
      message: '',
   }},
   created(){
    this.calendarOptions = {
      timeZone: 'local',
      plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin ],
      initialView: 'dayGridMonth',
      headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridDay,timeGridWeek,listWeek'
      },
      slotMinTime: "02:00:00", // ⏰ Hora mínima visible
      slotMaxTime: "22:00:00", // ⏰ Hora máxima visible
      slotDuration: "00:30:00", // ⏳ Duración de cada bloque
      slotLabelInterval: "01:00:00", // 🕒 Intervalo de etiquetas
      nowIndicator: true, // 🔴 Línea roja para la hora actual
      events: [],
      editable: true,
      dateClick: this.handleDateClick,
      eventClick: this.handleEventClick,
      eventDrop: this.handleEventDrop,
     };
   },
   mounted () {
     this.getEvents();
   },
   methods: {
    //...mapActions("events", ["fetchEvents"]), #TODO HACER QUE FUNCIONE QUE CARGUE LOS EVENTOS ANTES DE MOSTRAR EL CALENDARIO
    ...mapActions("events", ["saveEvent"]),
    async getEvents () {
      const response = await httpClient.get('/events/');
      this.calendarOptions.events = response.data;
    },
    closeAndReload() {
      this.window = false;
      this.askSave = false;
      this.localEvent = {};
      this.getEvents();
    },
    handleDateClick(info) {
      const selectedDate = info.dateStr;
      
      // ❌ Verificar si ya existe un evento allDay en esta fecha
      const existsAllDay = this.events.some(localEvent => localEvent.start === selectedDate && localEvent.allDay);
      
      if (existsAllDay) {
        alert("⚠ No puedes agregar eventos en un día con evento de todo el día.");
        return;
      }
      this.localEvent = info;
      this.isEdit = false;
      this.window = true;
    },
    handleEventClick(info) {
      this.isEdit = true;
      this.localEvent = info.event;
      if(this.localEvent.allDay == false) this.window = true;
    },
    handleEventDrop(info) {
      this.localEvent = info.event;
      this.message = "Do you want to save the changes?";
      this.askSave = true;
    },
    async toggleSaveEvent(){
      const localEvent = {
      id: this.localEvent.id,
      title: this.localEvent.title,
      start: this.localEvent.startStr,
      end: this.localEvent.endStr,
      color: this.localEvent.backgroundColor,
      allDay: this.localEvent.allDay
      };

      const request = await this.saveEvent(localEvent);
      if(request.status == 200){
        this.$store.dispatch("ui/triggerSnackbar", {message: "Event saved successfully", color: "success"}, { root: true });
        this.closeAndReload();
      }else{
        this.$store.dispatch("ui/triggerSnackbar", {message: "Error to save event", color: "error"}, { root: true });
      } 
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
    parseDateWithTime (date) {
      if (!date) return null
      return `${date}T${this.localEvent.time}`
    },
    getTime(date){
      const prueba = date.split('T');
      return date.split('T')[1];
    }
   }
 }
 
 </script>
 
 <style>
 </style>