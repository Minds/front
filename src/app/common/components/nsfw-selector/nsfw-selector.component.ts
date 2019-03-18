import {
  Component,
  EventEmitter,
  Input,
  Output, 
} from '@angular/core';
import { 
  NSFWSelectorCreatorService,
  NSFWSelectorConsumerService,
} from './nsfw-selector.service';
import { Storage } from '../../../services/storage';

@Component({
  selector: 'm-nsfw-selector',
  templateUrl: 'nsfw-selector.component.html',
})

export class NSFWSelectorComponent {

  @Input('consumer') consumer: false;
  @Output('selected') onSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    public creatorService: NSFWSelectorCreatorService,
    public consumerService: NSFWSelectorConsumerService,
    private storage: Storage,
  ) {
  }

  get service() {
    return this.consumer ? this.consumerService.build() : this.creatorService.build();
  }

  @Input('selected') set selected(selected: Array<number>) {
    for (let i in this.service.reasons) {
      this.creatorService.reasons[i].selected = selected.indexOf(this.creatorService.reasons[i].value) > -1;
    }
  }

  toggle(reason) {
    this.service.toggle(reason);

    const reasons = this.service.reasons.filter(r => r.selected);
    this.onSelected.next(reasons);
  }

  hasSelections(): boolean {
    for (let r of this.service.reasons) {
      if (r.selected)
        return true;
    }
  }

}
