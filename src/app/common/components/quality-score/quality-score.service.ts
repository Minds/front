import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from '../../api/api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Service responsible to interact with Minds engine to fetch results on account quality
 */
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
