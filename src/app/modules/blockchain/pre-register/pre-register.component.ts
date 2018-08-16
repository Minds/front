import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Client } from '../../../services/api/client';

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--pre-register',
  templateUrl: 'pre-register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainPreRegisterComponent implements OnInit {
  inProgress: boolean;
  success: boolean;
  error: string = '';

  constructor(protected changeDetectorRef: ChangeDetectorRef, protected client: Client) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    try {
      let result: any = await this.client.get(`api/v2/blockchain/tde/pre-register`);

      if (!result || typeof result.registered === 'undefined') {
        this.error = 'There was a server error';
      } else {
        this.success = result.registered;
      }
    } catch (e) {
      this.error = (e && e.message) || 'There was a server error';
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  detectChanges() {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  async preRegister() {
    this.inProgress = true;

    try {
      await this.client.post(`api/v2/blockchain/tde/pre-register`);

      this.success = true;
    } catch (e) {
      console.error('[TDE Register]', e);
      this.error = (e && e.message) || 'There was a server error';
    } finally {
      this.inProgress = false;

      this.detectChanges();
    }
  }
}
