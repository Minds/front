import { Pipe } from '@angular/core';

/**
 * Pipe to replace substring occurrences in a string.
 */
@Pipe({
  name: 'replace',
})
export class ReplacePipe {
  /**
   * Transform string by replacing all substring occurrences.
   * @param { string } value - value of input string.
   * @param { string } toReplace - substring to replace.
   * @param { string } replacement - substring to replace with.
   * @returns { string } string with replacement applied.
   */
  public transform(
    value: string,
    toReplaceString: string,
    replacementString: string
  ): string {
    if (!value || !toReplaceString || !replacementString) {
      return value;
    }

    return value.replace(toReplaceString, replacementString);
  }
}
