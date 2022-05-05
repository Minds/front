import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../../../common/api/client.service';

@Component({
  selector: 'm-plus--verify',
  templateUrl: 'verify.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusVerifyComponent {
  form: FormGroup;
  open: boolean = true;
  inProgress: boolean = false;
  @Output() closed: EventEmitter<any> = new EventEmitter(true);

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      link1: ['', Validators.required],
      link2: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  submit(e) {
    this.inProgress = true;
    this.detectChanges();
    this.client
      .post('api/v1/plus/verify', this.form.value)
      .then(response => {
        this.inProgress = false;
        this.open = false;
        this.closed.next(true);
        this.detectChanges();
      })
      .catch(() => {
        this.inProgress = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  setModalData() {}
}
