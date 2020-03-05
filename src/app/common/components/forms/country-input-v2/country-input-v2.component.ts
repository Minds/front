// import {
//   Component,
//   EventEmitter,
//   OnInit,
//   AfterViewInit,
//   OnChanges,
//   Input,
//   Output,
//   forwardRef,
//   Inject,
//   PLATFORM_ID,
//   ElementRef,
//   QueryList,
//   ViewChildren,
// } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// import { verticallyScrollElementIntoView } from '../../../../helpers/scrollable-container-visibility';
// import * as moment from 'moment';

// // export const COUNTRY_INPUT_VALUE_ACCESSOR: any = {
// //   provide: NG_VALUE_ACCESSOR,
// //   useExisting: forwardRef(() => CountryInputV2Component),
// //   multi: true,
// // };

// @Component({
//   selector: 'm-countryInput',
//   templateUrl: 'country-input-v2.component.html',
//   // providers: [COUNTRY_INPUT_VALUE_ACCESSOR],
// })
// export class CountryInputV2Component {
//   @Input() initCountryCode: string = '';
//   @Input('allowedCountries') set _allowed(allowed: string[]) {
//     if (!allowed) {
//       this.filteredCountries = this.countries;
//       return;
//     }

//     this.filteredCountries = this.countries.filter(item => {
//       return allowed.indexOf(item.code) > -1;
//     });
//   }
//   @Output() countryChange: EventEmitter<any> = new EventEmitter();

// countries;

//   filteredCountries: Array<{ name: string; code: string }> = [];

//   showDropdown: boolean = false;
//   countryCode: string;
//   init: boolean = false;
//   countryEls;

//   selectedCountry;
//   selectedCountryIndex = 0;

//   focused: boolean = false;
//   focusedCountryIndex = 0;

//   toggleTimeout;
//   scrollTimeout;

//   @ViewChildren('countryEl') countryElsList: QueryList<ElementRef>;

//   propagateChange = (_: any) => {};

//   constructor() {}

//   ngOnInit() {}

//   ngAfterViewInit() {
//     this.countryEls = this.countryElsList.toArray();
//   }

//   ngOnChanges(changes: any) {
//     this.propagateChange(changes);
//   }

//   ngOnDestroy() {
//     this.showDropdown = false;
//   }
// }
