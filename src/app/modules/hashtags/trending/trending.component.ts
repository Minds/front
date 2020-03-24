import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TrendingService } from '../service/trending.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'm-hashtags__trending',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'trending.component.html',
})
export class TrendingComponent {
  @Input() decoration: boolean = true;

  @Output('onAction') onActionEmitter: EventEmitter<string> = new EventEmitter<
    string
  >();

  constructor(protected service: TrendingService) {}

  /**
   * Getter for service's trending hashtags list
   */
  get trending$(): Observable<string[]> {
    return this.service.tags$.pipe(map(tags => tags.slice(0, 5)));
  }

  /**
   * Initialization (load trending hashtags)
   */
  ngOnInit() {
    this.service.load();
  }

  /**
   *
   * @param tag
   */
  onAction(tag: string) {
    this.onActionEmitter.emit(tag);
  }
}
