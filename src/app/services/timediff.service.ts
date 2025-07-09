import { interval } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimeDiffService {
  public source = interval(1000);
}
