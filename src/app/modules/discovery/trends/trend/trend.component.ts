import { Component } from '@angular/core';
import { Client } from '../../../../services/api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  EntitiesService,
  EntityObservable,
} from '../../../../common/services/entities.service';
import { last, first } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { FastFadeAnimation } from '../../../../animations';

@Component({
  selector: 'm-discovery__trend',
  templateUrl: './trend.component.html',
  animations: [FastFadeAnimation],
})
export class DiscoveryTrendComponent {
  entity$: Observable<Object> = of(null);

  constructor(
    private entitiesService: EntitiesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.loadEntity(params.get('guid'));
    });
  }

  async loadEntity(guid: string): Promise<void> {
    this.entity$ = this.entitiesService.single(`urn:entity:${guid}`);
  }
}
