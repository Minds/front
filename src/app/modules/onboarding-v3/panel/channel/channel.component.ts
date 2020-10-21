import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'm-onboardingV3__channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.ng.scss'],
})
export class OnboardingV3ChannelComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(256)]],
      bio: ['', [Validators.required, Validators.maxLength(2048)]],
      avatar: ['', Validators.required],
    });
  }

  public submit(): void {}
}
