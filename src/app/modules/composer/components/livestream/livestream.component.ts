import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LivestreamService } from '../../services/livestream.service';
import { interval, Subscription, take } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'm-composer__livestream',
  templateUrl: 'livestream.component.html',
  styleUrls: ['livestream.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveStreamComponent implements OnDestroy {
  streamUrl: string;
  safeStreamUrl: SafeResourceUrl;
  stream: any; // Define a property to hold the stream object
  streamCreated = false; // Flag to track if the stream is created
  private streamCheckSubscription: Subscription;
  private livestreamSubscription: Subscription;

  constructor(
    private sanitizer: DomSanitizer,
    private livestreamService: LivestreamService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.livestreamSubscription = this.livestreamService
      .getCreatedStream()
      .pipe(take(1))
      .subscribe(stream => {
        this.stream = stream;
        this.streamCreated = this.stream !== null;
        if (this.streamCreated) {
          this.checkStreamStatus(); // Start checking stream status
        }
        // Trigger change detection manually
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeStreamCheck();
    this.livestreamSubscription?.unsubscribe();
  }

  checkStreamStatus(): void {
    this.unsubscribeStreamCheck();
    this.streamCheckSubscription = interval(3000)
      .pipe(switchMap(() => this.livestreamService.getStream(this.stream.id)))
      .subscribe(stream => {
        this.stream = stream;
        if (this.stream && this.stream.isActive) {
          this.streamUrl = `https://minds-player.withlivepeer.com?v=${stream.playbackId}`;
          this.safeStreamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.streamUrl
          );
          this.unsubscribeStreamCheck();
        }

        this.cdRef.markForCheck();
      });
  }

  unsubscribeStreamCheck(): void {
    if (this.streamCheckSubscription) {
      this.streamCheckSubscription.unsubscribe();
      this.streamCheckSubscription = undefined;
    }
  }
}
