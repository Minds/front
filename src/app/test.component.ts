import { Component } from '@angular/core';
import { CommonModule } from './common/common.module';

@Component({
  selector: 'm-app',
  standalone: true,
  template: '<div>Hello world</div>',
  imports: [CommonModule],
})
export class TestComponent {}
