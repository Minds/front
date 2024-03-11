import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  forwardRef,
} from '@angular/core';
import { Subscription, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ApiService } from '../../../api/api.service';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  AutoCompleteEntityTypeEnum,
  EntitySearchResponse,
} from '../autocomplete-entity-input/autocomplete-entity-input.component';
import { CommonModule, CommonModule as NgCommonModule } from '@angular/common';
import { MindsGroup, MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';

/**
 * Entity typeahead input form control. Will pass out a list of users or groups based on the
 * entityType input, depending on the search string passed in.
 */
@Component({
  selector: 'm-formInput__entityTypeahead',
  styleUrls: ['./entity-typeahead.component.ng.scss'],
  imports: [ReactiveFormsModule, NgCommonModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntityTypeaheadComponent),
      multi: true,
    },
  ],
  standalone: true,
  template: `
    <form [formGroup]="formGroup">
      <input
        type="text"
        formControlName="searchTerm"
        name="searchTerm"
        id="searchTerm"
        autocomplete="off"
        [placeholder]="placeholder"
      />
    </form>
  `,
})
export class EntityTypeaheadComponent
  implements ControlValueAccessor, OnDestroy {
  /** Entity type. */

  @Input() protected entityType: AutoCompleteEntityTypeEnum =
    AutoCompleteEntityTypeEnum.User;

  /** Limit of results returned. */
  @Input() protected limit: number = 24;

  /** Placeholder for input. */
  @Input() protected placeholder: string = 'Search';

  /** Whether to return logged in user as an option. */
  @Input() protected filterSelf: boolean = true;

  /** Outputs on loading state emission. */
  @Output('loading') protected readonly loadingEmitter: EventEmitter<
    boolean
  > = new EventEmitter<boolean>();

  protected formGroup: FormGroup;

  private searchTermSubscription: Subscription;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private session: Session
  ) {
    this.formGroup = this.formBuilder.group({
      searchTerm: [''],
    });
  }

  ngOnInit() {
    this.searchTermSubscription = this.formGroup
      .get('searchTerm')
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        filter(searchTerm => searchTerm.trim().length > 0),
        tap((_: unknown) => this.loadingEmitter.emit(true)),
        switchMap((searchTerm: string) =>
          this.api.get<EntitySearchResponse>(
            `api/v2/search/suggest/${
              this.entityType === AutoCompleteEntityTypeEnum.Group
                ? 'group'
                : 'user'
            }`,
            {
              q: searchTerm.trim(),
              limit: this.limit,
              hydrate: 1,
            }
          )
        ),
        tap(() => this.loadingEmitter.emit(false)),
        catchError(e => {
          console.error(e);
          this.loadingEmitter.emit(false);
          return of([]);
        })
      )
      .subscribe((results: EntitySearchResponse) => {
        if (this.filterSelf) {
          this.propagateChange(
            results.entities.filter(
              (entity: MindsUser | MindsGroup) =>
                entity.guid !== this.session.getLoggedInUser()?.guid
            )
          );
        } else {
          this.propagateChange(results.entities);
        }
      });
  }

  ngOnDestroy(): void {
    this.searchTermSubscription?.unsubscribe();
  }

  /**
   * Write value to form control.
   */
  writeValue(value: MindsUser[] | MindsGroup[]): void {
    this.formGroup.get('searchTerm').setValue(value);
  }

  /**
   * The value of this function is set from the
   * registerOnChange function. We have a default value
   * that doesn't do anything.
   */
  public propagateChange = (_: any) => {};

  /**
   * @inheritDoc
   * The function provides the callback function that we will call to
   * tell the parent form that the value has changed.
   */
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * The value of this function is set from registerOnTouched.
   * The default value doesn't do anything.
   */
  public propagateTouched = () => {};

  /**
   * @inheritDoc
   */
  public registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }
}
