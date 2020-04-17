import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'm-settingsV2__youtubeMigration',
  templateUrl: './youtube-migration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2YoutubeMigrationComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
