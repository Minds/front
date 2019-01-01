import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { GroupsProfile } from "../profile";
import { Observable } from "rxjs";
import { VideoChatService } from "../../../videochat/videochat.service";

@Injectable()
export class CanDeactivateGroupService implements CanDeactivate<GroupsProfile> {
  constructor(private videochatService: VideoChatService) {}

  canDeactivate(
    component: GroupsProfile,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      if (this.videochatService.isActive) {
        resolve(confirm("Are you sure you want to leave the gathering?"));
      } else {
        resolve(true);
      }
    });
  }
}
