import { Injectable } from '@angular/core';
import { EntitiesService } from '../../../../common/services/entities.service';

@Injectable()
export class SortedService {
  constructor(protected entitiesService: EntitiesService) {}
}
