import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class PageLayoutService {
  hasRightPane$: BehaviorSubject<boolean> = new BehaviorSubject(false);
}
