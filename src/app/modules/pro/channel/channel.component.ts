import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Session } from "../../../services/session";
import { Subscription } from "rxjs";
import { MindsUser } from "../../../interfaces/entities";
import { Client } from "../../../services/api/client";
import { Title } from "@angular/platform-browser";
import { ProService } from "../pro.service";

@Component({
  selector: 'm-pro--channel',
  templateUrl: 'channel.component.html'
})

export class ProChannelComponent {
  minds = window.Minds;

  username: string;

  user: MindsUser = null;

  error: string;

  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    private proService: ProService,
    private client: Client,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      }

      if (!this.session.isLoggedIn()) {
        this.router.navigate(['/pro', this.username, 'signup']);
      }

      this.loadChannel();
    });
  }

  async loadChannel() {
    try {
      this.user = await this.proService.loadChannel(this.username);

      this.title.setTitle(`${this.user.name} (@${this.user.username})`);
    } catch (e) {
      this.error = e.getMessage();
    }
  }

}
