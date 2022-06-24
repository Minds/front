import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { skip } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { CompassService } from '../../../compass/compass.service';
import { CompassQuestionnaireModalComponent } from '../../../compass/questionnaire-modal/questionnaire-modal.component';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Build your algorithm notice.
 */
@Component({
  selector: 'm-feedNotice--buildYourAlgorithm',
  templateUrl: 'build-your-algorithm-notice.component.html',
})
export class BuildYourAlgorithmNoticeComponent extends AbstractSubscriberComponent {
  constructor(
    private router: Router,
    private modalService: ModalService,
    private compassService: CompassService,
    private feedNotice: FeedNoticeService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    // listen for answers provided and dismiss modal if they are.
    this.subscriptions.push(
      this.compassService.answersProvided$
        // skip emission during subscription and emission during open.
        .pipe(skip(2))
        .subscribe((provided: boolean) => {
          if (provided) {
            this.modalService.dismissAll();
            this.dismiss();
          }
        })
    );
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onPrimaryOptionClick($event: MouseEvent): void {
    this.modalService.present(CompassQuestionnaireModalComponent);
  }

  /**
   * Called on secondary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onSecondaryOptionClick($event: MouseEvent): void {
    this.router.navigate([
      '/minds/blog/build-your-algorithm-phase-1-1317916094152839188',
    ]);
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('build-your-algorithm');
  }
}
