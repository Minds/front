import { interval } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class TimeDiffService {
    public source = interval(1000);
    
    static _() {
        return new TimeDiffService();
    }
}