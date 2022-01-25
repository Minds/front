import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from '../../api/api.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class QualityScoreService {
  constructor(private apiService: ApiService) {}

  public getUserQualityScore(targetUser: string): Observable<number> {
    return this.apiService.get(`api/v3/account-quality/${targetUser}`).pipe(
      map((response: ApiResponse) => {
        return response.results.score;
      })
    );
  }
}
