import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ConfigsService } from '../../services/configs.service';
import { string } from 'yargs';

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
    this.statusPageUrl =
      this.configs.get('statuspage_io').url ?? 'https://status.minds.com';
  }

  onToast(): Observable<StatusToast> {
    return this.subject.asObservable();
  }

  update(): void {
    this.unresolvedIncidentsTracker = JSON.parse(
      JSON.stringify(this.unresolvedIncidents)
    );

    this.fetchUnresolvedIncidents().subscribe((data) => {
      if (!data) {
        return;
      }

      // Remove any incidents we already know about
      // from the tracker array. Process any
      // new unresolved incidents
      if (data.incidents) {
        data.incidents.forEach((incident) => {
          if (
            !this.findAndRemove(incident.id, this.unresolvedIncidentsTracker)
          ) {
            this.processNewUnresolvedIncident(incident);
          }
        });
      }
    });

    // At this point, any remaining incidents in the tracker will have been resolved
    this.showResolvedToasts();
  }

  processNewUnresolvedIncident(incident: any): void {
    // Show the toast
    this.trigger(false, incident);
    // Add incident to list of unresolved incidents
    this.unresolvedIncidents.push(incident);
  }

  showResolvedToasts(): void {
    this.unresolvedIncidentsTracker.forEach((incident) => {
      // Show the toast
      this.trigger(true, incident);
      // Remove it from list of unresolved incidents
      this.findAndRemove(incident.id, this.unresolvedIncidents);
    });
  }

  // Returns true if an incident was found and removed
  findAndRemove(id: string, array: Array<any>): boolean {
    const index = array.findIndex((incident) => incident.id === id);

    if (index > -1) {
      array.splice(index, 1);
      return true;
    } else {
      return false;
    }
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
