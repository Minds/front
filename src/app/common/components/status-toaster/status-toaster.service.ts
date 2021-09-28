import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ConfigsService } from '../../services/configs.service';

export interface StatusToast {
  resolved: boolean;
  incident: any;
  dismissed?: boolean;
}
@Injectable()
export class StatusToasterService {
  statusPageUrl: string;
  toasts: StatusToast[] = [];
  unresolvedIncidents: Array<any> = [];
  resolvedIncidentsTracker: Array<any> = [];

  private subject = new Subject<StatusToast>();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, protected configs: ConfigsService) {
    this.statusPageUrl = this.configs.get('statuspage_io')
      ? this.configs.get('statuspage_io').url
      : 'https://status.minds.com';
  }

  fetchUnresolvedIncidents(): Observable<any> {
    return this.http
      .get<any>(this.statusPageUrl + '/api/v2/incidents/unresolved.json')
      .pipe(retry(1), catchError(this.handleError));
  }

  async update(): Promise<void> {
    // Set up array of known incidents to cross-check with the fetched data,
    // removing the known incidents from the tracker as we go.
    //
    // After we've checked all of the fetched incidents,
    // the ones that remain in the tracker will be
    // the ones that have been resolved
    this.resolvedIncidentsTracker = JSON.parse(
      JSON.stringify(this.unresolvedIncidents)
    );

    this.fetchUnresolvedIncidents().subscribe(fetched => {
      if (!fetched) {
        return;
      }
      // Process any new unresolved incidents
      if (fetched.incidents) {
        fetched.incidents.forEach(incident => {
          // Check if we've already seen an incident with this id
          const index = this.resolvedIncidentsTracker.findIndex(
            unresolved => unresolved.id === incident.id
          );

          if (index < 0) {
            // If we've never seen this incident before, process it
            this.processNewUnresolvedIncident(incident);
          } else {
            // We've already seen this incident's id,
            if (
              this.resolvedIncidentsTracker[index].updated_at !==
              incident.updated_at
            ) {
              // If this known incident has been updated
              // since we last showed a toast about it,
              // trigger a new toast
              this.trigger(false, incident);
              // and replace the latest version in our list of unresolvedIncidents
              this.unresolvedIncidents.splice(index, 1, incident);
            }
            // Remove any incidents we've seen before from the tracker
            this.resolvedIncidentsTracker.splice(index, 1);
          }
        });
      }
      // At this point, any remaining incidents in the tracker will have been resolved
      this.showResolvedToasts();
    });
  }

  processNewUnresolvedIncident(incident: any): void {
    // Show the toast
    this.trigger(false, incident);
    // Add incident to list of unresolved incidents
    this.unresolvedIncidents.push(incident);
  }

  showResolvedToasts(): void {
    this.resolvedIncidentsTracker.forEach(incident => {
      // Show the toast
      this.trigger(true, incident);
      // Remove it from list of unresolved incidents
      const index = this.unresolvedIncidents.findIndex(
        unresolved => unresolved.id === incident.id
      );
      if (index > -1) {
        this.unresolvedIncidents.splice(index, 1);
      }
    });
  }

  trigger(resolved: boolean, incident: any): void {
    const toast: StatusToast = {
      resolved: resolved,
      incident: incident,
    };
    this.subject.next(toast);
  }

  onToast(): Observable<StatusToast> {
    return this.subject.asObservable();
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
