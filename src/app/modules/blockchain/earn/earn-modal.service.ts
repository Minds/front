import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { EarnModalComponent } from './earn-modal.component';
import { ModalService } from '../../../services/ux/modal.service';

@Injectable()
export class EarnModalService {
  constructor(private modalService: ModalService, private injector: Injector) {}

  async open(): Promise<any> {
    const { EarnModalModule } = await import('./earn-modal.module');
    const onSuccess$: Subject<any> = new Subject();
    await this.modalService.present(EarnModalComponent, {
      lazyModule: EarnModalModule,
      injector: this.injector,
      size: 'lg',
    }).result;
    return onSuccess$.toPromise();
  }
}
