<template>
    <v-card>
        <v-card-title :style="{ backgroundColor: color }">
        <span >{{ title }}</span>
        </v-card-title>
        <v-card-text>
        <v-container>
            <v-form ref="form" v-model="isFormValid" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                        label="Name*"
                        v-model="title"
                        outlined
                        :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-menu
                        ref="menuStart"
                        v-model="menuStart"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="start"
                                label="Start*"
                                hint="MM/DD/YYYY"
                                outlined
                                v-mask="'##/##/####'"
                                persistent-hint
                                append-icon="mdi-calendar"
                                v-bind="attrs"
                                @blur="date = parseDate(start)"
                                :rules="[rules.required]"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="dateStart"
                            no-title
                            @input="menuStart = false"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="4">
                        <v-menu
                            v-if="!allDay"
                            ref="menuEnd"
                            v-model="menuEnd"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="auto"
                            
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-if="!allDay"
                                v-model="end"
                                label="End*"
                                outlined
                                hint="MM/DD/YYYY"
                                v-mask="'##/##/####'"
                                persistent-hint
                                append-icon="mdi-calendar"
                                :rules="[rules.required, rules.dateOlder(start, end)]"
                                v-bind="attrs"
                                @blur="date = parseDate(end)"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="dateEnd"
                            no-title
                            @input="menuEnd = false"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="3">
                        <v-checkbox
                            v-model="allDay"
                            label="All day"
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field
                        v-if="!allDay"
                        v-model="timeStart"
                        outlined
                            label="Time Start*"
                            v-mask="'##:##'"
                            hint="HH:MM"
                            persistent-hint
                            :rules="[rules.validTime(timeStart), rules.required]"
                            required
                            append-icon="mdi-clock-outline"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field
                            v-if="!allDay"
                            outlined
                            v-model="timeEnd"
                            label="Time End*"
                            v-mask="'##:##'"
                            hint="HH:MM"
                            persistent-hint
                            :rules="[rules.validTime(timeEnd), rules.required]"
                            required
                            append-icon="mdi-clock-outline"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                            v-model="color"
                            outlined
                            :items="colors"
                            label="Color*"
                            item-text="nameColor"
                            item-value="hexColor"
                            :rules="[rules.required]"
                            >
                        </v-select>
                    </v-col>
                    
                </v-row>
            </v-form>
        </v-container>
        <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
            <v-btn text @click="toggleDeleteEvent">
                <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="error"
                @click="cancelar()"
                outlined
            >
                Close
            </v-btn>
            <v-btn
                :disabled="!isFormValid"
                color="success"
                @click="toggleSaveEvent()"
                outlined
            >
                Save
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import rules from '@/utils/helpers/rules';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Event',
    props: {
        eventProp: {
            type: Object,
            required: false
        },
        isEditProp: {
            type: Boolean,
            required: false
        },
    },
    data: vm => ({
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
        menuStart: false,
        menuEnd: false,
        isFormValid: false,
        dateStart: '',
        dateEnd: '',
        title: '',
        eventId: '',
        color: '',
        start: '',
        end: '',
        timeStart: '',
        timeEnd: '',
        allDay: false,
        isAllDay: false,
        rules: rules,
        colors: [
            { nameColor: 'Blue', hexColor: '#0d82ef' },
            { nameColor: 'Red', hexColor: '#f44336' },
            { nameColor: 'Green', hexColor: '#0db093' },
            { nameColor: 'Yellow', hexColor: '#f4b400' },
            { nameColor: 'Purple', hexColor: '#9c27b0' },
            { nameColor: 'Orange', hexColor: '#ff9800' },
            { nameColor: 'Pink', hexColor: '#e91e63' },
            { nameColor: 'Brown', hexColor: '#795548' },
            { nameColor: 'Grey', hexColor: '#9e9e9e' },
            { nameColor: 'Black', hexColor: '#000000' },
            { nameColor: 'White', hexColor: '#ffffff' }
        ],
        snackbarMessage: "",
        snackbarType: "success",
        snackbarVisible: false
    }),
    created(){
        this.setEvent();
    },
    computed: {
        ...mapGetters("events", ["event"]),
    },
    watch: {
        dateStart (val) {
            this.start = this.formatDate(val)
        },
        dateEnd (val) {
            this.end = this.formatDate(val)
        },
    },
    methods:{
        ...mapActions("events", [ "getEventById","saveEvent","deleteEvent"]),
        toggleSaveEvent(){
            const event = {
                id: this.eventId,
                title: this.title,
                start: this.parseDateWithTime(this.parseDate(this.start), this.timeStart),
                end: this.parseDateWithTime(this.parseDate(this.end), this.timeEnd),
                color: this.color,
                allDay: this.allDay
            };
            try {
                this.saveEvent(event);
                this.$store.dispatch("ui/triggerSnackbar", {message: "Evento saved successfully", color: "success"}, { root: true });
                this.cancelar();
            } catch (error) {
                this.$store.dispatch("ui/triggerSnackbar", {message: "Error to save event", color: "error"}, { root: true });
            }
        },
        cancelar() {
            this.$emit("closeAndReload");
        },
        async fetchEvent() {
            try {
                await this.getEventById(this.eventProp.id);
            } catch (error) {
                this.$store.dispatch("ui/triggerSnackbar", {message: "Something was wrong", color: "error"}, { root: true });
            }
            this.eventId = this.event.id;
            this.title = this.event.title;
            this.start = this.formatDate(this.event.start);
            this.end = this.formatDate(this.event.end);
            this.timeStart = this.getTime(this.event.start);
            this.timeEnd = this.getTime(this.event.end);
            this.color = this.event.color;
            this.allDay = this.event.allDay;
        },
        setEvent(){
            if(this.isEditProp){
                this.fetchEvent();
            }
            else{
                this.start = this.formatDate(this.eventProp.dateStr);
                if(this.eventProp.view.type == 'timeGridDay' || this.eventProp.view.type == 'timeGridWeek'){
                    this.timeStart = this.getTime(this.eventProp.dateStr);
                }
            };
            
        },
        async toggleDeleteEvent(){
            const request = await this.deleteEvent(this.eventId);
            if (request.status === 204){
                this.snackbarMessage = "Evento eliminado con éxito: " + request.data.title;
                this.snackbarType = "success";
            }else{
                this.snackbarMessage = "Error deleting event";
                this.snackbarType = "error";
            }
            this.snackbarVisible = true;
            this.cancelar();
        
        },
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${month}/${day.substr(0, 2)}/${year}`
        },
        parseDate (date) {
            if (!date) return null

            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        parseDateWithTime (date, time) {
            if (!date) return null
            return `${date}T${time}`
        },
        getTime(date){
            return date.substr(11, 5);
        }
    }
};
</script>

<style>
</style>