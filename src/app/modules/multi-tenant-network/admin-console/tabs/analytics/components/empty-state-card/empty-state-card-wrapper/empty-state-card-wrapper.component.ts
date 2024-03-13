import { Component, Inject, Input } from '@angular/core';
import { AnalyticsTableEnum } from '../../../../../../../../../graphql/generated.engine';
import { ComposerService } from '../../../../../../../composer/services/composer.service';
import { ComposerModalService } from '../../../../../../../composer/components/modal/modal.service';
import { Router } from '@angular/router';
import { CopyToClipboardService } from '../../../../../../../../common/services/copy-to-clipboard.service';
import { SITE_URL } from '../../../../../../../../common/injection-tokens/url-injection-tokens';
import { ToasterService } from '../../../../../../../../common/services/toaster.service';

/**
 * Wrapper component for empty state cards - contains switch
 * to show appropriate card based upon inputted type.
 */
@Component({
  selector: 'm-networkAdminAnalytics__emptyStateCardWrapper',
  template: `
    <ng-container [ngSwitch]="type">
      <m-networkAdminAnalytics__emptyStateCard
        *ngSwitchCase="AnalyticsTableEnum.PopularActivities"
        title="Ignite the conversation"
        icon="local_fire_department"
        description="The top posts from across the network will appear here."
        ctaText="Create a post"
        (onAction)="onCreatePostClick()"
      ></m-networkAdminAnalytics__emptyStateCard>
      <m-networkAdminAnalytics__emptyStateCard
        *ngSwitchCase="AnalyticsTableEnum.PopularGroups"
        title="Be a pioneer in group exploration"
        icon="group"
        description="There are no groups on the network yet. Check back later for detailed analytics once someone has created a group."
        ctaText="Create group"
        (onAction)="onCreateGroupClick()"
      ></m-networkAdminAnalytics__emptyStateCard>
      <m-networkAdminAnalytics__emptyStateCard
        *ngSwitchCase="AnalyticsTableEnum.PopularUsers"
        title="Get ready for exploration"
        icon="person"
        description="There are no channels apart from yours on the network. Check back later for detailed analytics."
        ctaText="Copy invite link"
        ctaIcon="content_copy"
        (onAction)="onContentCopyClick()"
      ></m-networkAdminAnalytics__emptyStateCard>
    </ng-container>
  `,
  providers: [ComposerModalService, ComposerService],
})
export class NetworkAdminAnalyticsEmptyStateCardWrapperComponent {
  /** Enum for use in a template. */
  protected AnalyticsTableEnum: typeof AnalyticsTableEnum = AnalyticsTableEnum;

  /** Type to determine which card to show. */
  @Input() protected readonly type: AnalyticsTableEnum;

  constructor(
    private composerModalService: ComposerModalService,
    private copyToClipboardService: CopyToClipboardService,
    private router: Router,
    private toaster: ToasterService,
    @Inject(SITE_URL) private readonly siteUrl: string
  ) {}

  /**
   * Handles create post click.
   * @returns { void }
   */
  protected onCreatePostClick(): void {
    this.composerModalService.present();
  }

  /**
   * Handles create group click.
   * @returns { void }
   */
  protected onCreateGroupClick(): void {
    this.router.navigateByUrl('/groups/create');
  }

  /**
   * Handles content copy click.
   * @returns { Promise<void> }
   */
  protected async onContentCopyClick(): Promise<void> {
    await this.copyToClipboardService.copyToClipboard(this.siteUrl);
    this.toaster.success('Link copied to clipboard');
  }
}
