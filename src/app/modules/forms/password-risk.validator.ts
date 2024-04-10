import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, take, switchMap, map } from 'rxjs/operators';
import { Client } from '../../services/api';
// import { PasswordRiskService } from '../../services/password-risk.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordRiskValidator {
  constructor(private client: Client) {}

  riskValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {
      const val = control.value;

      if (val === null || val.length === 0) {
        return of(null);
      } else {
        return control.valueChanges.pipe(
          debounceTime(300),
          take(1),
          switchMap((_) =>
            this.client
              .post('api/v3/security/password/risk', {
                password: val,
              })
              .then((response: any) => {
                if (response && response.status === 'success') {
                  if (response.risk) {
                    return { passwordSecurityFailed: true };
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
