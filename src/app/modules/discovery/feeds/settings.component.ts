import { Component, ElementRef, SkipSelf } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DiscoveryFeedsService } from './feeds.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Modal } from '../../../services/ux/modal.service';
import { NsfwEnabledService } from '../../multi-tenant-network/services/nsfw-enabled.service';

const noOp = () => {};

/**
 * Modal that controls what content type(s) are shown in a
 * discovery feed, and also whether NSFW content is to be shown
 */
@Component({
  selector: 'm-discovery__feedSettings',
  templateUrl: './settings.component.html',
})
export class DiscoveryFeedsSettingsComponent implements Modal<any> {
  saving$: Observable<boolean> = this.service.saving$;
  filter$: Observable<string> = this.service.filter$;
  subscriptions: Subscription[];
  onSaveIntent: (data?: any) => void = noOp;

  form: UntypedFormGroup;
  readonly periodOptions: { id: string; label: string }[] = [
    { id: 'relevant', label: 'Most relevant' },
    { id: '12h', label: '12h' },
    { id: '24h', label: '24h' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: '1y', label: '1y' },
  ];

  readonly contentTypes: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
  ];

  readonly nsfwOptions: {
    id: string;
    label: string;
    selected: boolean;
  }[] = this.service.nsfwService.reasons.map((reason) => {
    return { id: reason.value, label: reason.label, selected: reason.selected };
  });

  constructor(
    private service: DiscoveryFeedsService,
    private fb: UntypedFormBuilder,
    protected nsfwEnabledService: NsfwEnabledService
  ) {
    this.form = fb.group({
      period: fb.control(''),
      contentType: fb.control(''),
      showNsfw: fb.control(
        this.nsfwOptions.filter((reason) => reason.selected).length > 0
      ),
      nsfw: fb.array(this.nsfwOptions.map((reason) => reason.selected)),
    });
  }

  /**
   * Modal data
   * @param data
   */
  setModalData(data: { onSave: (payload: any) => void }) {
    this.onSaveIntent = data.onSave;
  }

  ngOnInit() {
    this.subscriptions = [
      this.service.period$.subscribe((period) => {
        this.form.controls.period.setValue(period);
      }),
      this.service.type$.subscribe((type) => {
        this.form.controls.contentType.setValue(type);
      }),
      this.form.controls.showNsfw.valueChanges.subscribe((value) => {
        this.form.controls.nsfw.setValue(this.nsfwOptions.map(() => value));
      }),
      this.form.controls.nsfw.valueChanges.subscribe((nsfw) => {
        if (
          nsfw.filter((selected) => selected === true).length === 0 &&
          this.form.controls.showNsfw.value
        ) {
          this.form.controls.showNsfw.setValue(false);
        }
      }),
    ];
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async onSave(e: Event): Promise<void> {
    const values = this.form.value;

    const nsfwReasons = this.service.nsfwService.reasons.slice(0); // Slice to clone
    for (let i in values.nsfw) {
      nsfwReasons[i].selected = values.nsfw[i];
    }

    this.service.setNsfw(nsfwReasons);
    this.service.setPeriod(values.period);
    this.service.setType(values.contentType);

    this.onSaveIntent();
  }

  get hasNsfwSelections(): boolean {
    return (
      this.form.controls.nsfw.value.filter((selected) => selected === true)
        .length > 0
    );
  }
}
