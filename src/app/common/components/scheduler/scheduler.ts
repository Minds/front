import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-scheduler',
  inputs: ['days'],
  outputs: ['update: ts'],
  template: `
    <!-- Day -->
    <select
      name="date"
      [(ngModel)]="selectedDate"
      (change)="onChange($event)"
      class="mdl-color-text--blue-grey-800 m-form-select"
    >
      <option *ngFor="let d of dates; let i = index" [value]="i">
        {{ d.formatted }}
      </option>
    </select>
    <!-- Hour -->
    <select
      name="hour"
      [(ngModel)]="selectedHour"
      (change)="onChange($event)"
      class="mdl-color-text--blue-grey-800 m-form-select"
    >
      <option *ngFor="let h of hours; let i = index" [value]="i">
        {{ h.label }}
      </option>
    </select>
    <b>:</b>
    <!-- Minutes -->
    <select
      name="minutes"
      [(ngModel)]="selectedMinutes"
      (change)="onChange($event)"
      class="mdl-color-text--blue-grey-800 m-form-select"
    >
      <option *ngFor="let m of minutes; let i = index" [value]="i">
        {{ m.label }}
      </option>
    </select>
  `,
})
export class Scheduler {
  days: number = 3;
  update: EventEmitter<any> = new EventEmitter(true);

  selectedDate = 0;
  selectedHour = 0;
  selectedMinutes = 0;

  dates = [];
  hours = [];
  minutes = [];

  constructor() {
    this.setUp();
  }

  setUp() {
    //3 days
    for (var days = 0; days < this.days; days++) {
      var date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + days);
      this.dates.push({
        date: date,
        ts: date.getTime(),
        formatted:
          date.getDate() +
          this.getSuffix(date.getDate()) +
          ' ' +
          date.toLocaleString('en-us', { month: 'long' }),
      });
    }
    this.setUpHours();
    this.setUpMinutes();
    var now = new Date();
    this.selectedHour = now.getHours();
    this.selectedMinutes = Math.round(now.getMinutes() / 5);
  }

  onChange(e?) {
    this.compileTs();
  }

  setUpHours() {
    for (var i = 0; i < 24; i++) {
      this.hours.push({ value: i, label: i });
    }
  }

  setUpMinutes() {
    for (var i = 0; i < 12; i++) {
      var minute = i * 5;
      this.minutes.push({ value: minute, label: minute });
    }
  }

  getSuffix(day) {
    if (day > 20 || day < 10) {
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
      }
    }
    return 'th';
  }

  compileTs() {
    var date = new Date();
    date.setDate(this.dates[this.selectedDate].date.getDate());
    date.setHours(this.selectedHour, this.selectedMinutes * 5, 0, 0);
    var ts = date.getTime();
    console.log(
      'emitting change',
      ts,
      date,
      this.dates[this.selectedDate].date,
      this.selectedHour,
      this.selectedMinutes * 5
    );
    this.update.next(ts);
  }
}
