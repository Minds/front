import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'friendlydatediff',
})
export class FriendlyDateDiffPipe implements PipeTransform {
  transform(
    value: string | number,
    reference: string | number = null,
    displaySuffix: boolean = true
  ): any {
    if (!value) {
      return value;
    }

    let referenceDate = new Date();

    if (reference) {
      referenceDate = new Date(<string>reference);
    }

    const dateValue = new Date(<string>value);

    const suffix = displaySuffix ? ' ago' : '';

    if (dateValue >= referenceDate) {
      return '0s' + suffix;
    }

    let differenceMs = referenceDate.getTime() - dateValue.getTime();
    let seconds = Math.floor(differenceMs / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let weeks = Math.floor(days / 7);
    let years = Math.floor(weeks / 52);

    if (years > 0) {
      return `${years}y ${suffix}`;
    }

    if (weeks > 0) {
      return `${weeks}w ${suffix}`;
    }

    if (days > 0) {
      return `${days}d ${suffix}`;
    }

    if (hours > 0) {
      return `${hours}h ${suffix}`;
    }

    if (minutes > 0) {
      return `${minutes}m ${suffix}`;
    }

    return `${seconds}s ${suffix}`;
  }
}
