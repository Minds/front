import { Client } from './../../../../../services/api/client';
import { Session } from './../../../../../services/session';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-channel__nostr',
  templateUrl: './nostr.component.html',
  styleUrls: ['./nostr.component.scss'],
})
export class ChannelNostrComponent implements OnInit {
  publicKey$: BehaviorSubject<string> = new BehaviorSubject('');
  username: string = this.session.getLoggedInUser()?.username;

  constructor(private client: Client, private session: Session) {}

  ngOnInit(): void {
    this.client
      .get(`.well-known/nostr.json?name=${this.username}`)
      .then((result: any) => {
        this.publicKey$.next(result?.names?.[this.username]);
      });
  }
}
