import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class EntityResolverServiceOptions {
  get ref(): string {
    return this._ref;
  }

  set ref(value: string) {
    this._ref = value;
  }

  get refType(): 'guid' | 'username' {
    return this._refType;
  }

  set refType(value: 'guid' | 'username') {
    this._refType = value;
  }

  private _refType: 'guid' | 'username';

  private _ref: string;
}

@Injectable({ providedIn: 'root' })
export class EntityResolverService {
  constructor(private apiService: ApiService) {}

  public get$<T>(opt: EntityResolverServiceOptions): Observable<T | null> {
    return this.apiService
      .get<T>(`api/v3/entities/${opt.ref}`)
      .pipe(catchError((e) => of(null)));
  }
}
