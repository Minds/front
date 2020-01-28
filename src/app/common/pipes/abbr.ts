import { Pipe, Inject, Renderer } from '@angular/core';

@Pipe({
  name: 'abbr',
})
export class AbbrPipe {
  numberAbbrev = ['k', 'm', 'b', 't'];
  bytesAbbrev = ['K', 'M', 'G', 'T'];

  transform(
    number: number | any,
    decimals: number = 2,
    isBytes: boolean = false
  ) {
    const abbrev = isBytes ? this.bytesAbbrev : this.numberAbbrev;

    // 2 decimal places => 100, 3 => 1000, etc
    decimals = Math.pow(10, decimals);

    // Go through the array backwards, so we do the largest first
    for (let i = abbrev.length - 1; i >= 0; i--) {
      // Convert array index to "1000", "1000000", etc
      const size = Math.pow(10, (i + 1) * 3);

      // If the number is bigger or equal do the abbreviation
      if (size <= number) {
        // Here, we multiply by decPlaces, round, and then divide by decPlaces.
        // This gives us nice rounding to a particular decimal place.
        number = Math.round((number * decimals) / size) / decimals;

        // Handle special case where we round up to the next abbreviation
        if (number === 1000 && i < abbrev.length - 1) {
          number = 1;
          i++;
        }

        // Add the letter for the abbreviation
        number += abbrev[i];
        break;
      }
    }
    return number;
  }
}
