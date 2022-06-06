import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import { ApiService } from './../../../../../common/api/api.service';
import { ChannelsV2Service } from './../../channels-v2.service';

@Component({
  selector: 'm-channel__nostr',
  templateUrl: './nostr.component.html',
  styleUrls: ['./nostr.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelNostrComponent {
  constructor(private api: ApiService, public service: ChannelsV2Service) {}

  public publicKey$: Observable<string | null> = this.service.channel$
    .pipe(takeWhile(channel => Boolean(channel)))
    .pipe(
      switchMap(channel =>
        this.api.get(`.well-known/nostr.json?name=${channel?.username}`)
      )
    )
    .pipe(map(response => Object.values(response?.names || {})[0] as string));
}
