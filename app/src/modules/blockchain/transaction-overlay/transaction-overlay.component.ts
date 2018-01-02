import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionOverlayService } from './transaction-overlay.service';

@Component({
  selector: 'm--blockchain--transaction-overlay',
  template: `
    <div class="m--blockchain--transaction-overlay--content">
      <h2 class="m--blockchain--transaction-overlay--title">
        {{ title }}
      </h2>
      <div class="m--blockchain--transaction-overlay--subtitle">
        Please open your Metamask client to complete the transaction.
      </div>
      <div class="m--blockchain--transaction-overlay--note" *ngIf="notes">
        {{ notes }}
      </div>

      <div class="m--blockchain--transaction-overlay--help"><a [href]="minds.site_url + 'coin'" target="_blank">Having issues?</a></div>
    </div>
  `
})

export class TransactionOverlayComponent implements OnInit {
  @Input() title: string;
  @HostBinding('hidden') _isHidden: boolean = true;
  // @HostBinding('class.m--blockchain--transaction-overlay--visible') private _isVisible: boolean = false;
  notes: string;

  minds: Minds = window.Minds;

  constructor(private router: Router, private service: TransactionOverlayService) {
    this.service.setComponent(this);
  }

  ngOnInit() {
  }

  get isHidden() {
    return this._isHidden;
  }

  show(title: string, notes: string) {
    this.title = title;
    this._isHidden = false;
    this.notes = notes;
  }

  hide() {
    this._isHidden = true;
  }

  goToSupport() {
    this.router.navigate(['/coin']);
  }
}
