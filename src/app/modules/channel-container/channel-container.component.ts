import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Client } from '../../services/api/client';
import { MindsUser } from '../../interfaces/entities';
import { MindsChannelResponse } from '../../interfaces/responses';
import { ChannelComponent } from '../channels/channel.component';
import { ProChannelComponent } from '../pro/channel/channel.component';

@Component({
  selector: 'm-channel-container',
  templateUrl: 'channel-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ChannelContainerComponent implements OnInit, OnDestroy {

  inProgress: boolean = false;

  channel: MindsUser;

  protected username: string;

  protected param$: Subscription;

  @ViewChild('channelComponent', { static: false }) channelComponent: ChannelComponent;

  @ViewChild('proChannelComponent', { static: false }) proChannelComponent: ProChannelComponent;

  constructor(
    protected route: ActivatedRoute,
    protected client: Client,
  ) {
  }

  ngOnInit(): void {
    this.param$ = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];

        if (this.username && (!this.channel || this.channel.username != this.username)) {
          this.load();
        }
      }
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.channelComponent) {
      return this.channelComponent.canDeactivate();
    }

    return true;
  }

  ngOnDestroy(): void {
    this.param$.unsubscribe();
  }

  async load() {
    if (!this.username) {
      return;
    }

    this.inProgress = true;

    try {
      const response: MindsChannelResponse = await this.client.get(`api/v1/channel/${this.username}`) as MindsChannelResponse;
      this.channel = response.channel;
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
  }
}
