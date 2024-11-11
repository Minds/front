import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  combineLatest,
  filter,
  firstValueFrom,
  forkJoin,
  map,
  of,
  take,
} from 'rxjs';
import { MultiTenantConfigImageService } from '../../../services/config-image.service';
import { HttpEvent } from '@angular/common/http';
import { ApiResponse } from '../../../../../common/api/api.service';
import {
  MultiTenantColorScheme,
  MultiTenantConfig,
  SetMultiTenantConfigMutationVariables,
} from '../../../../../../graphql/generated.engine';
import { MultiTenantNetworkConfigService } from '../../../services/config.service';
import { MultiTenantConfigImageRefreshService } from '../../../services/config-image-refresh.service';
import { MetaService } from '../../../../../common/services/meta.service';

/**
 * Multi-tenant network admin panel's customize tab. Allows the user
 * to customize site branding and appearance.
 */
@Component({
  selector: 'm-networkAdminConsole__customize',
  templateUrl: './customize.component.html',
  styleUrls: [
    './customize.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleCustomizeComponent
  implements OnInit, OnDestroy
{
  /** Whether loading is in progress. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Form group. */
  public formGroup: FormGroup;

  /** Color scheme enum for access in template.  */
  public readonly MultiTenantColorScheme: typeof MultiTenantColorScheme =
    MultiTenantColorScheme;

  /** Whether saving is in progress. */
  public readonly savingInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Storing a reference to a square logo file pre-upload. */
  public readonly squareLogoFile$: BehaviorSubject<File> =
    new BehaviorSubject<File>(null);

  /** Storing a reference to a horizontal logo file pre-upload. */
  public readonly horizontalLogoFile$: BehaviorSubject<File> =
    new BehaviorSubject<File>(null);

  /** Storing a reference to a favicon files pre-upload. */
  public readonly faviconFile$: BehaviorSubject<File> =
    new BehaviorSubject<File>(null);

  /** URL for square logo  - if no file is stored pre-upload, points to server. */
  public readonly squareLogoFileUrl$: Observable<string> = combineLatest([
    this.squareLogoFile$,
    this.configImageService.squareLogoPath$,
  ]).pipe(
    map(([file, squareLogoPath]) => {
      return file
        ? `url(${URL.createObjectURL(file)})`
        : `url(${squareLogoPath}`;
    })
  );

  /** URL for favicon - if no file is stored pre-upload, points to server. */
  public readonly faviconFileUrl$: Observable<string> = combineLatest([
    this.faviconFile$,
    this.configImageService.faviconPath$,
  ]).pipe(
    map(([file, faviconPath]) => {
      return file ? `url(${URL.createObjectURL(file)})` : `url(${faviconPath}`;
    })
  );

  /** URL for horizontal logo - if no file is stored pre-upload, points to server. */
  public readonly horizontalLogoFileUrl$: Observable<string> = combineLatest([
    this.horizontalLogoFile$,
    this.configImageService.horizontalLogoPath$,
  ]).pipe(
    map(([file, horizontalLogoPath]) => {
      return file
        ? `url(${URL.createObjectURL(file)})`
        : `url(${horizontalLogoPath}`;
    })
  );

  // subscriptions
  private submitDataSubscription: Subscription;
  private configLoadSubscription: Subscription;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private configImageService: MultiTenantConfigImageService,
    private configImageRefreshCountService: MultiTenantConfigImageRefreshService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
    private metaService: MetaService
  ) {
    this.formGroup = this.formBuilder.group({
      primaryColorHex: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(8),
      ]),
      colorScheme: new FormControl<MultiTenantColorScheme>(
        MultiTenantColorScheme.Light,
        [Validators.required]
      ),
    });
  }

  ngOnInit(): void {
    // setup initial form values based on server response / defaults.
    this.configLoadSubscription = this.multiTenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        this.primaryColorHexFormControl.setValue(
          config?.primaryColor ?? '#1b85d6'
        );
        this.colorSchemeFormControl.setValue(
          config?.colorScheme ?? MultiTenantColorScheme.Light
        );
        this.loading$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.submitDataSubscription?.unsubscribe();
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * Form control for primaryColor.
   * @returns { AbstractControl<string> } form control for primary color.
   */
  get primaryColorHexFormControl(): AbstractControl<string> {
    return this.formGroup.get('primaryColorHex');
  }

  /**
   * Form control for colorScheme.
   * @returns { AbstractControl<MultiTenantColorScheme> } form control for color scheme.
   */
  get colorSchemeFormControl(): AbstractControl<MultiTenantColorScheme> {
    return this.formGroup.get('colorScheme');
  }

  /**
   * Submits changes to server.
   * @returns { void }
   */
  public onSubmit(): void {
    let requests: Observable<HttpEvent<ApiResponse> | boolean>[] = [];

    // get list of requests for images to upload.
    let uploadRequests: Observable<HttpEvent<ApiResponse>>[] =
      this.buildFileUploadRequests();

    if (uploadRequests.length) {
      requests.push(...uploadRequests);
    }

    // build request to update config endpoint.
    let updateConfigRequest: Observable<boolean> =
      this.buildUpdateConfigRequest();

    if (updateConfigRequest) {
      requests.push(updateConfigRequest);
    }

    if (!requests.length) {
      return;
    }

    this.savingInProgress$.next(true);

    // fire requests in parralel.
    this.submitDataSubscription = forkJoin(requests)
      .pipe(
        take(1),
        catchError((e: unknown): Observable<null> => {
          console.error(e);
          return of(null);
        })
      )
      .subscribe((events: any): void => {
        this.savingInProgress$.next(false);

        if (!events?.length || !events.filter(Boolean)?.length) {
          this.toaster.error('An unknown error has occurred');
          return;
        }

        // increment counts so that images can be refreshed at other locations around the site.
        if (uploadRequests?.length) {
          if (this.squareLogoFile$.getValue()) {
            this.configImageRefreshCountService.updateSquareLogoLastCacheTimestamp();
          }

          if (this.horizontalLogoFile$.getValue()) {
            this.configImageRefreshCountService.updateHorizontalLogoLastCacheTimestamp();
          }

          if (this.faviconFile$.getValue()) {
            this.configImageRefreshCountService.updateFaviconLastCacheTimestamp();

            // refresh favicon.
            this.refreshDynamicFavicon();
          }

          // reset images or the next submit request will re-upload the same images.
          this.squareLogoFile$.next(null);
          this.horizontalLogoFile$.next(null);
          this.faviconFile$.next(null);
        }

        this.toaster.success('Successfully updated appearance.');
        this.formGroup.markAsPristine();
      });
  }

  /**
   * Called when a new square logo file is selected.
   * @param { File } file - file to upload.
   * @returns { void }
   */
  public onSquareLogoSelected(file: File): void {
    if (!file || !this.validateFileType(file)) {
      this.toaster.error('A valid file must be provided.');
      return;
    }

    this.formGroup.markAsDirty();
    this.squareLogoFile$.next(file);
  }

  /**
   * Called when a new favicon file is selected.
   * @param { File } file - file to upload.
   * @returns { void }
   */
  public onFaviconSelected(file: File): void {
    if (!file || !this.validateFileType(file)) {
      this.toaster.error('A valid file must be provided.');
      return;
    }

    this.formGroup.markAsDirty();
    this.faviconFile$.next(file);
  }

  /**
   * Called when a new horizontal logo file is selected.
   * @param { File } file - file to upload.
   * @returns { void }
   */
  public onHorizontalLogoSelected(file: File): void {
    if (!file || !this.validateFileType(file)) {
      this.toaster.error('A valid file must be provided.');
      return;
    }

    this.formGroup.markAsDirty();
    this.horizontalLogoFile$.next(file);
  }

  /**
   * Called when a color scheme container is clicked.
   * @param { MultiTenantColorScheme } colorScheme - color scheme to set.
   */
  public onColorSchemeContainerClick(
    colorScheme: MultiTenantColorScheme
  ): void {
    this.colorSchemeFormControl.setValue(colorScheme);
    this.colorSchemeFormControl.markAsDirty();
  }

  /**
   * Builds a list of requests to upload files that have been changed / are
   * queued for upload in UI.
   * @returns { Observable<HttpEvent<ApiResponse>>[] } - array of observable requests.
   */
  private buildFileUploadRequests(): Observable<HttpEvent<ApiResponse>>[] {
    let uploadRequests: Observable<HttpEvent<ApiResponse>>[] = [];

    const squareLogoFile: File = this.squareLogoFile$.getValue();
    if (squareLogoFile) {
      uploadRequests.push(
        this.configImageService.upload(squareLogoFile, 'square_logo')
      );
    }

    const horizontalLogoFile: File = this.horizontalLogoFile$.getValue();
    if (horizontalLogoFile) {
      uploadRequests.push(
        this.configImageService.upload(horizontalLogoFile, 'horizontal_logo')
      );
    }

    const faviconFile: File = this.faviconFile$.getValue();
    if (faviconFile) {
      uploadRequests.push(
        this.configImageService.upload(faviconFile, 'favicon')
      );
    }

    return uploadRequests;
  }

  /**
   * Builds request to updae configs.
   * @returns { Observable<boolean> } - observable of request.
   */
  private buildUpdateConfigRequest(): Observable<boolean> {
    let variables: Omit<SetMultiTenantConfigMutationVariables, 'tenantId'> = {};

    if (this.colorSchemeFormControl.dirty) {
      variables.colorScheme = this.colorSchemeFormControl.value;
    }
    if (this.primaryColorHexFormControl.dirty) {
      variables.primaryColor = this.primaryColorHexFormControl.value;
    }

    return Object.keys(variables).length
      ? this.multiTenantConfigService.updateConfig(variables)
      : null;
  }

  /**
   * Validates file type.
   * @param { File } file - file to validate.
   * @returns { boolean } - true if valid.
   */
  private validateFileType(file: File): boolean {
    return this.configImageService.validateFileType(file);
  }

  /**
   * Sets the site favicon to the last uploaded favicon.
   * @returns { Promise<void> }
   */
  private async refreshDynamicFavicon(): Promise<void> {
    this.metaService.setDynamicFavicon(
      await firstValueFrom(this.configImageService.faviconPath$)
    );
  }
}
