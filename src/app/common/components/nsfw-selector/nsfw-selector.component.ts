import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NSFWSelectorCreatorService,
  NSFWSelectorConsumerService,
  NSFWSelectorEditingService,
} from './nsfw-selector.service';
import { Storage } from '../../../services/storage';
import { ifError } from 'assert';

@Component({
  selector: 'm-nsfw-selector',
  templateUrl: 'nsfw-selector.component.html',
  providers: [NSFWSelectorEditingService],
})
export class NSFWSelectorComponent {
  @Input('service') serviceRef: string = 'consumer';
  @Input('consumer') consumer: false;
  @Input('expanded') expanded: false;
  @Output('selectedChange') onSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    public creatorService: NSFWSelectorCreatorService,
    public consumerService: NSFWSelectorConsumerService,
    private editingService: NSFWSelectorEditingService,
    private storage: Storage
  ) {}

  ngOnInit() {
    if (this.service.reasons) {
      for (const reason of this.service.reasons) {
        this.toggle(reason.value, false);
      }
    }
  }

  get service() {
    switch (this.serviceRef) {
      case 'editing':
        return this.editingService.build();
        break;
    }
    return this.consumer
      ? this.consumerService.build()
      : this.creatorService.build();
  }

  @Input('selected') set selected(selected: Array<number>) {
    for (let i in this.service.reasons) {
      this.service.reasons[i].selected =
        selected.indexOf(this.service.reasons[i].value) > -1;
    }
  }

  @Input('locked') set locked(locked: Array<number>) {
    for (let i in this.service.reasons) {
      if (this.service.reasons[i].selected) {
        this.service.reasons[i].locked =
          locked.indexOf(this.service.reasons[i].value) > -1;
      }
    }
  }

  toggle(reason, triggerChange = true) {
    if (reason.locked) {
      return;
    }

    this.service.toggle(reason);

    if (triggerChange) {
      const reasons = this.service.reasons.filter(r => r.selected);
      this.onSelected.next(reasons);
    }
  }

  hasSelections(): boolean {
    for (let r of this.service.reasons) {
      if (r.selected) return true;
    }
  }
}
