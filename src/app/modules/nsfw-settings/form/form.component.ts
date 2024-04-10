import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DiscoveryFeedsService } from '../../discovery/feeds/feeds.service';

/**
 * Draft of nsfw settings form
 * Unused and unfinished because design is still being finalized
 */
@Component({
  selector: 'm-nsfwSettings__form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.ng.scss'],
})
export class NsfwSettingsFormComponent implements OnInit, OnDestroy {
  saving$: Observable<boolean> = this.discoveryFeedsService.saving$;
  subscriptions: Subscription[];
  // onSaveIntent: () => void = noOp;

  form;

  readonly nsfwOptions: {
    id: string;
    label: string;
    selected: boolean;
  }[] = this.discoveryFeedsService.nsfwService.reasons.map((reason) => {
    return { id: reason.value, label: reason.label, selected: reason.selected };
  });

  constructor(
    private discoveryFeedsService: DiscoveryFeedsService,
    // private nsfwSettingsService: NsfwSettingsService,
    private fb: UntypedFormBuilder
  ) {
    this.form = fb.group({
      showNsfw: fb.control(
        this.nsfwOptions.filter((reason) => reason.selected).length > 0
      ),
      nsfw: fb.array(this.nsfwOptions.map((reason) => reason.selected)),
    });
  }

  ngOnInit(): void {
    this.subscriptions = [
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
      // this.nsfwSettingsService.submitRequested$.subscribe(
      //   requested =>
      //     {
      //       if(requested) {
      //         this.submit();
      //       },
      //     }
      // ),
    ];

    // this.subscriptions.push(
    //   this.nsfwSettingsService.submitRequested$.subscribe(requested => {
    //     if (requested) {
    //       this.submit();
    //     }
    //   })
    // );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async submit(): Promise<void> {
    const values = this.form.value;

    if (this.canSubmit) {
      const nsfwReasons =
        this.discoveryFeedsService.nsfwService.reasons.slice(0); // Slice to clone
      for (let i in values.nsfw) {
        nsfwReasons[i].selected = values.nsfw[i];
      }

      this.discoveryFeedsService.setNsfw(nsfwReasons);
      // await this.nsfwSettingsService.saveSettings();
    }
  }

  canSubmit(): boolean {
    return this.form.valid && !this.form.pristine;
  }

  get hasNsfwSelections(): boolean {
    return (
      this.form.controls.nsfw.value.filter((selected) => selected === true)
        .length > 0
    );
  }
}
