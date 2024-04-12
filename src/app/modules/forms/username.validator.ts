import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, take, switchMap } from 'rxjs/operators';
import { Client } from '../../services/api';

@Injectable({
  providedIn: 'root',
})
export class UsernameValidator {
  constructor(private client: Client) {}

  existingUsernameValidator(initialUsername: string = ''): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {
      const val = control.value;

      if (val === null || val.length === 0) {
        return of(null);
      } else if (val === initialUsername) {
        return of(null);
      } else {
        return control.valueChanges.pipe(
          debounceTime(500),
          take(1),
          switchMap((_) =>
            this.client
              .get('api/v3/register/validate', {
                username: val,
              })
              .then((response: any) => {
                if (response && response.status === 'success') {
                  let exists = !response.valid;
                  if (exists) {
                    return { existingUsername: true };
                  }
                  return null;
                }
              })
              .catch((e) => {
                console.log(e);
                return null;
              })
          )
        );
      }
    };
  }
}
