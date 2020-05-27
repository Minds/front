import { Directive, Input } from '@angular/core';
import {
  ClientMetaData,
  ClientMetaService,
} from '../services/client-meta.service';

@Directive({
  selector: '[clientMeta]',
  providers: [ClientMetaService],
})
export class ClientMetaDirective {
  @Input('clientMeta') clientMetaData: Partial<ClientMetaData>;

  constructor() {
    console.log('clientmetadirective');
  }
}
