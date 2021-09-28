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
  unresolvedIncidentsTracker: Array<any> = [];

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

  onToast(): Observable<StatusToast> {
    return this.subject.asObservable();
  }

  async update(): Promise<void> {
    // Set up array of known incidents to cross-check with the new data
    // Remove the known incidents as we go, so we'll know which ones are new
    // and need to be toasted
    this.unresolvedIncidentsTracker = JSON.parse(
      JSON.stringify(this.unresolvedIncidents)
    );
    this.fetchUnresolvedIncidents().subscribe(fetched => {
      if (!fetched) {
        return;
      }
      // Remove any incidents we already know about
      // from the tracker array so that we know what has been resolved.
      // Process any new unresolved incidents
      if (fetched.incidents) {
        fetched.incidents.forEach(incident => {
          // If we already know about this incident's id
          const index = this.unresolvedIncidentsTracker.findIndex(
            unresolved => unresolved.id === incident.id
          );

          // We haven't seen this incident before - process it
          if (index < 0) {
            this.processNewUnresolvedIncident(incident);
          } else {
            // We know about this incident so we remove it from the tracker
            this.removeFromTracker(index);
            // This known incident has been updated since we last showed a toast about it
            if (
              this.unresolvedIncidentsTracker[index].updated_at !==
              incident.updated_at
            ) {
              // Replace incident in list of unresolvedIncidents
              this.unresolvedIncidents.splice(index, 1, incident);
              // trigger a new toast
              this.trigger(false, incident);
            }
          }
        });
      }
      // At this point, any remaining incidents in the tracker will have been resolved
      this.showResolvedToasts();
    });
  }

  removeFromTracker(index: number): void {
    if (index < 0) {
      return;
    }
    this.unresolvedIncidentsTracker.splice(index, 1);
  }

  processNewUnresolvedIncident(incident: any): void {
    // Show the toast
    this.trigger(false, incident);
    // Add incident to list of unresolved incidents
    this.unresolvedIncidents.push(incident);
  }

  showResolvedToasts(): void {
    this.unresolvedIncidentsTracker.forEach(incident => {
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

  fetchUnresolvedIncidents(): Observable<any> {
    return this.http
      .get<any>(this.statusPageUrl + '/api/v2/incidents/unresolved.json')
      .pipe(retry(1), catchError(this.handleError));
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
