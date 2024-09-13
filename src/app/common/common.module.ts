import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MINDS_PIPES } from './pipes/pipes';
import { TopbarWalletBalance } from './layout/topbar/topbar-wallet-balance/topbar-wallet-balance.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { QualityScoreComponent } from './components/quality-score/quality-score.component';
import { SizeableLoadingSpinnerComponent } from './components/sizeable-loading-spinner/sizeable-loading-spinner.component';
import { FooterComponent } from './components/footer/footer.component';
import { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
import { CountryInputComponent } from './components/forms/country-input/country-input.component';
import { CityFinderComponent } from './components/forms/city-finder/city-finder.component';
import { ReadMoreDirective } from './read-more/read-more.directive';
import { ReadMoreButtonComponent } from './read-more/button.component';
import { ChannelBadgesComponent } from './components/badges/badges.component';
import { NSFWSelectorComponent } from './components/nsfw-selector/nsfw-selector.component';
import {
  NSFWSelectorConsumerService,
  NSFWSelectorCreatorService,
} from './components/nsfw-selector/nsfw-selector.service';
import { Scheduler } from './components/scheduler/scheduler';
import { Modal } from './components/modal/modal.component';
import { MindsRichEmbed } from './components/rich-embed/rich-embed';
import { QRCodeComponent } from './components/qr-code/qr-code.component';
import { MDL_DIRECTIVES } from './directives/material';
import { AutoGrow } from './directives/autogrow';
import { InlineAutoGrow } from './directives/inline-autogrow';
import { Emoji } from './directives/emoji';
import { ScrollLock } from './directives/scroll-lock';
import { TagsLinks } from './directives/tags';
import { Tooltip } from './directives/tooltip';
import { MindsAvatar } from './components/avatar/avatar';
import { Textarea } from './components/editors/textarea.component';

import { DynamicHostDirective } from './directives/dynamic-host.directive';
import { MindsCard } from './components/card/card.component';

import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { InlineEditorComponent } from './components/editors/inline-editor.component';
import { AttachmentService } from '../services/attachment';
import { IfBrowserDirective } from './directives/if-browser.directive';
import { TreeComponent } from './components/tree/tree.component';
import { AnnouncementComponent } from './components/announcements/announcement.component';
import { PhoneInputComponent } from './components/phone-input/phone-input.component';
import { PhoneInputCountryComponent } from './components/phone-input/country.component';
import { Session } from '../services/session';
import { MindsHttpClient } from './api/client.service';
import { SafeToggleComponent } from './components/safe-toggle/safe-toggle.component';
import { ThumbsUpButton } from './components/thumbs/thumbs-up.component';
import { ThumbsDownButton } from './components/thumbs/thumbs-down.component';
import { GraphSVG } from './components/graphs/svg';
import { GraphPoints } from './components/graphs/points';
import { DynamicFormComponent } from './components/forms/dynamic-form/dynamic-form.component';
import { SortSelectorComponent } from './components/sort-selector/sort-selector.component';

import { UpdateMarkersService } from './services/update-markers.service';
import { SocketsService } from '../services/sockets';
import { HttpClient } from '@angular/common/http';
import { AndroidAppDownloadComponent } from './components/android-app-download-button/button.component';
import { FeaturedContentComponent } from './components/featured-content/featured-content.component';
import { FeaturedContentService } from './components/featured-content/featured-content.service';
import { DraggableListComponent } from './components/draggable-list/list.component';
import { DndModule } from 'ngx-drag-drop';
import { SiteService } from './services/site.service';
import { ToggleComponent } from './components/toggle/toggle.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DataTabsLayoutComponent } from './components/data-tabs-layout/data-tabs-layout.component';
import { DataTabsHeaderComponent } from './components/data-tabs-header/data-tabs-header.component';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { DropdownSelectorComponent } from './components/dropdown-selector/dropdown-selector.component';
import { ButtonComponent } from './components/button/button.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { SsoService } from './services/sso.service';
import { DataTabsComponent } from './components/data-tabs/data-tabs.component';
import { TimespanFilterComponent } from './components/timespan-filter/timespan-filter.component';
import { PagesService } from './services/pages.service';
import { DateDropdownsComponent } from './components/date-dropdowns/date-dropdowns.component';
import { CookieService } from './services/cookie.service';
import { MediaProxyService } from './services/media-proxy.service';
import { RelatedContentService } from './services/related-content.service';
import { FormInputCheckboxComponent } from './components/forms/checkbox/checkbox.component';
import { AttachmentPasteDirective } from './directives/paste/attachment-paste.directive';
import { PhoneInputV2Component } from './components/phone-input-v2/phone-input-v2.component';
import { PhoneInputCountryV2Component } from './components/phone-input-v2/country.component';
import { RegexService } from './services/regex.service';
import { ExplicitOverlayComponent } from './components/explicit-overlay/overlay.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { SidebarNavigationService } from './layout/sidebar/navigation.service';
import { TopbarService } from './layout/topbar.service';
import { UserMenuComponent } from './layout/topbar/user-menu/user-menu.component';
import { NestedMenuComponent } from './layout/nested-menu/nested-menu.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { IconComponent } from './components/icon/icon.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { AttachmentApiService } from './api/attachment-api.service';
import { ApiService } from './api/api.service';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import {
  PageLayoutContainerDirective,
  PageLayoutPaneDirective,
} from './layout/page-layout.directive';
import { SidebarWidgetComponent } from './components/sidebar-widget/sidebar-widget.component';
import { SidebarNavigationSubnavDirective } from './layout/sidebar/subnav.directive';
import { FeedFilterComponent } from './components/feed-filter/feed-filter.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AccordionPaneComponent } from './components/accordion/accordion-pane.component';
import { StickySidebarDirective } from './components/sticky-sidebar/sticky-sidebar.directive';
import { PaywallBadgeComponent } from './components/paywall-badge/paywall-badge.component';
import { ClientMetaDirective } from './directives/client-meta.directive';
import { ClientMetaService } from './services/client-meta.service';
import { CarouselComponent } from './components/carousel/carousel.component';
import { PoweredByComponent } from './components/powered-by/powered-by.component';
import { LoadingEllipsisComponent } from './components/loading-ellipsis/loading-ellipsis.component';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { ConfirmV2Component } from '../modules/modals/confirm-v2/confirm.component';
import { EnvironmentFlagComponent } from '../common/components/environment-flag/environment-flag.component';
import { ErrorSplashComponent } from './components/error-splash/error-splash.component';
import { LaunchButtonComponent } from './components/launch-button/launch-button.component';
import { PublisherCardComponent } from './components/publisher-card/publisher-card.component';
import { SubscribeButtonComponent } from './components/subscribe-button/subscribe-button.component';
import { DownloadActivityMediaService } from './services/download-activity-media.service';
import { HotkeyScrollDirective } from './directives/hotkey-scroll.directive';
import { ChatIconComponent } from './components/chat-icon/chat-icon.component';
import { PublisherSearchModalComponent } from './components/publisher-search-modal/publisher-search-modal.component';
import { PublisherSearchModalService } from './services/publisher-search-modal.service';
import { DateRangeModalComponent } from './components/date-range-modal/date-range-modal.component';
import { DateRangeModalService } from './components/date-range-modal/date-range-modal.service';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { HovercardComponent } from './components/hovercard/hovercard.component';
import { QRCodeModule } from 'angularx-qrcode';
import { JsonLdService } from './services/jsonld.service';
import { FormInputSliderComponent } from './components/slider/slider.component';
import { FormInputSliderV2Component } from './components/slider/v2/slider.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { SidebarMoreComponent } from './layout/sidebar-more/sidebar-more.component';
import { SidebarMoreTriggerComponent } from './layout/sidebar-more/sidebar-more-trigger/sidebar-more-trigger.component';
import { TagSelectorComponent } from './components/tag-selector/tag-selector.component';

import { ModalCloseButtonComponent } from './components/modal-close-button/modal-close-button.component';
import { BlurhashDirective } from './directives/blurhash/blurhash.directive';
import { AuthRedirectService } from './services/auth-redirect.service';
import { RelativeTimeSpanComponent } from './components/relative-time-span/relative-time-span.component';
import { SubscriptionService } from './services/subscription.service';
import { RecentSubscriptionsService } from './services/recent-subscriptions.service';
import { ResizedDirective } from './directives/resized.directive';
import { DropdownMenuItemComponent } from './components/dropdown-menu-item/dropdown-menu-item.component';
import { PreventDoubleClickDirective } from './directives/prevent-double-click.directive';
import { SeeLatestPostsButtonComponent } from './components/see-latest-posts-button/see-latest-posts-button.component';
import { ReportService } from './services/report.service';
import { UserAggregatorComponent } from './components/user-aggregator/user-aggregator.component';
import { ViewedDirective } from './directives/viewed.directive';
import { FriendlyCaptchaComponent } from '../modules/captcha/friendly-catpcha/friendly-captcha.component';
import { BoostButton } from './components/boost-button/boost';
import { FeedHeaderComponent } from './components/feed-header/feed-header.component';
import { AutocompleteUserInputComponent } from './components/forms/autocomplete-user-input/autocomplete-user-input.component';
import { AddBankPromptComponent } from './components/add-bank-information/add-bank-prompt.component';
import { ChipBadgeComponent } from './components/chip-badge/chip-badge.component';
import { SocialIcons } from './components/social-icons/social-icons';
import { UserCard } from './components/user-card/user';
import { CommentButton } from './components/comment-button/comment';
import { SubscribeButton } from './components/subscribe-button-v1/subscribe';
import { MindsBanner } from './components/banner/banner';
import { SeeLatestButtonComponent } from './components/see-latest-button/see-latest-button.component';
import { SupermindBadgeComponent } from './components/supermind-badge/supermind-badge.component';
import { PathMatch } from './types/angular.types';
import { BoostFeedService } from '../modules/newsfeed/services/boost-feed.service';
import { BoostedFlagComponent } from './components/boosted-flag/boosted-flag.component';
import { SidebarNavigationV2Component } from './layout/sidebar/navigation-v2/navigation-v2.component';
import { SidebarNavigationNewContentDotComponent } from './layout/sidebar/new-content-dot/new-content-dot.component';
import { TopbarAlertComponent } from './components/topbar-alert/topbar-alert.component';
import { ChatwootWidgetComponent } from './components/chatwoot-widget/chatwoot-widget.component';
import { MarkdownModule } from 'ngx-markdown';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { GroupMembershipButtonComponent } from './components/group-membership-button/group-membership-button.component';
import { GroupMembershipService } from './services/group-membership.service';
import { SelectableEntityCardComponent } from './components/selectable-entity-card/selectable-entity-card.component';
import { InlineFeedHeaderComponent } from './components/inline-feed-header/inline-feed-header.component';
import { ExploreTagFeedItemComponent } from './components/explore-tag-feed-item/explore-tag-feed-item.component';
import { ExploreFeedItemComponent } from './components/explore-feed-item/explore-feed-item.component';
import { IfTenantDirective } from './directives/if-tenant.directive';
import { IsTenantService } from './services/is-tenant.service';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { NoticeComponent } from './components/notice/notice.component';
import { FeatureCarouselComponent } from './components/feature-carousel/feature-carousel.component';
import { PlanCardComponent } from './components/plan-card/plan-card.component';
import { AutocompleteEntityInputComponent } from './components/forms/autocomplete-entity-input/autocomplete-entity-input.component';
import { PublisherListComponent } from './components/publisher-list/publisher-list.component';
import { TopbarNetworkTrialBannerComponent } from './components/topbar-network-trial-banner/topbar-network-trial-banner.component';
import { ThrottledClickDirective } from './directives/throttled-click.directive';
import { ShowOnHoverDirective } from './directives/show-on-hover-directive';
import { CustomNavigationItemsComponent } from './layout/sidebar/custom-navigation-items/custom-navigation-items.component';
import { TopbarEnablePushNotificationsBannerComponent } from './components/topbar-enable-push-notifications-banner/topbar-enable-push-notifications-banner.component';

const MINDS_COMMON_COMPONENTS = [
  AccordionComponent,
  AccordionPaneComponent,
  AndroidAppDownloadComponent,
  AnnouncementComponent,
  BoostButton,
  ButtonComponent,
  CalendarComponent,
  CarouselComponent,
  ChannelBadgesComponent,
  ChatIconComponent,
  CityFinderComponent,
  CommentButton,
  ConfirmV2Component,
  CountryInputComponent,
  CustomNavigationItemsComponent,
  DashboardLayoutComponent,
  DataTabsComponent,
  DataTabsHeaderComponent,
  DataTabsLayoutComponent,
  DateDropdownsComponent,
  DateRangeModalComponent,
  DateSelectorComponent,
  DraggableListComponent,
  DropdownMenuComponent,
  DropdownMenuItemComponent,
  DropdownSelectorComponent,
  DynamicFormComponent,
  EnvironmentFlagComponent,
  ErrorSplashComponent,
  ExpansionPanelComponent,
  ExplicitOverlayComponent,
  ExploreFeedItemComponent,
  FeaturedContentComponent,
  FeatureCarouselComponent,
  FeedFilterComponent,
  FileUploadComponent,
  FooterComponent,
  FormInputCheckboxComponent,
  FormInputSliderComponent,
  FormInputSliderV2Component,
  FriendlyCaptchaComponent,
  GroupMembershipButtonComponent,
  HovercardComponent,
  IconComponent,
  InfiniteScroll,
  InlineEditorComponent,
  LaunchButtonComponent,
  LoadingEllipsisComponent,
  LoadingSpinnerComponent,
  MindsAvatar,
  MindsBanner,
  MindsCard,
  MindsRichEmbed,
  Modal,
  ModalCloseButtonComponent,
  NestedMenuComponent,
  NSFWSelectorComponent,
  OverlayComponent,
  PaywallBadgeComponent,
  PhoneInputComponent,
  PhoneInputCountryComponent,
  PhoneInputCountryV2Component,
  PhoneInputV2Component,
  PoweredByComponent,
  PublisherCardComponent,
  PublisherListComponent,
  PublisherSearchModalComponent,
  QRCodeComponent,
  QualityScoreComponent,
  ReadMoreButtonComponent,
  RelativeTimeSpanComponent,
  SafeToggleComponent,
  Scheduler,
  SeeLatestPostsButtonComponent,
  SeeLatestButtonComponent,
  SidebarMoreComponent,
  SidebarMoreTriggerComponent,
  SidebarNavigationV2Component,
  SidebarWidgetComponent,
  SizeableLoadingSpinnerComponent,
  SocialIcons,
  SortSelectorComponent,
  SubscribeButton,
  SubscribeButtonComponent,
  SupermindBadgeComponent,
  TagSelectorComponent,
  Textarea,
  ThumbsDownButton,
  ThumbsUpButton,
  TimespanFilterComponent,
  ToasterComponent,
  ToggleComponent,
  TooltipComponent,
  TopbarComponent,
  TopbarWalletBalance,
  TreeComponent,
  UserAggregatorComponent,
  UserCard,
  UserMenuComponent,
  AutocompleteUserInputComponent,
  AutocompleteEntityInputComponent,
  AddBankPromptComponent,
  ChipBadgeComponent,
  BoostedFlagComponent,
  SidebarNavigationNewContentDotComponent,
  TopbarAlertComponent,
  ChatwootWidgetComponent,
  FormErrorComponent,
  SelectableEntityCardComponent,
  InlineFeedHeaderComponent,
  ExploreTagFeedItemComponent,
  NoticeComponent,
  PlanCardComponent,
  TopbarNetworkTrialBannerComponent,
  TopbarEnablePushNotificationsBannerComponent,
];
// ------------------------------------
// ------------------------------------
const MINDS_DIRECTIVES = [
  AttachmentPasteDirective,
  AutofocusDirective,
  AutoGrow,
  BlurhashDirective,
  ClientMetaDirective,
  DragAndDropDirective,
  DynamicHostDirective,
  Emoji,
  GraphPoints,
  GraphSVG,
  HotkeyScrollDirective,
  IfBrowserDirective,
  IfTenantDirective,
  InlineAutoGrow,
  PageLayoutContainerDirective,
  PageLayoutPaneDirective,
  PreventDoubleClickDirective,
  ReadMoreDirective,
  ResizedDirective,
  ScrollLock,
  SidebarNavigationSubnavDirective,
  StickySidebarDirective,
  TagsLinks,
  Tooltip,
  ViewedDirective,
  FeedHeaderComponent,
  ThrottledClickDirective,
  ShowOnHoverDirective,
];
// ------------------------------------
// ------------------------------------
const routes: Routes = [
  {
    path: 'email-confirmation',
    redirectTo: '/',
    pathMatch: 'full' as PathMatch,
  },
];
// ------------------------------------
// ------------------------------------
@NgModule({
  imports: [
    NgCommonModule,
    DndModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPopperjsModule,
    QRCodeModule,
    RouterModule.forChild(routes),
    MarkdownModule.forChild(),
  ],
  declarations: [
    MINDS_COMMON_COMPONENTS,
    MINDS_DIRECTIVES,
    MINDS_PIPES,
    MDL_DIRECTIVES,
  ],
  exports: [
    MINDS_COMMON_COMPONENTS,
    MINDS_DIRECTIVES,
    MINDS_PIPES,
    MDL_DIRECTIVES,
    NgxPopperjsModule,
  ],
  providers: [
    SiteService,
    SsoService,
    AttachmentService,
    CookieService,
    PagesService,
    AttachmentService,
    {
      provide: UpdateMarkersService,
      useFactory: (_http, _session, _sockets) => {
        return new UpdateMarkersService(_http, _session, _sockets);
      },
      deps: [MindsHttpClient, Session, SocketsService],
    },
    {
      provide: MindsHttpClient,
      useFactory: MindsHttpClient._,
      deps: [HttpClient, CookieService],
    },
    NSFWSelectorCreatorService,
    NSFWSelectorConsumerService,
    {
      provide: FeaturedContentService,
      useFactory: (
        boostFeedService: BoostFeedService
      ): FeaturedContentService => new FeaturedContentService(boostFeedService),
      deps: [BoostFeedService],
    },
    MediaProxyService,
    SidebarNavigationService,
    RelatedContentService,
    RegexService,
    ApiService,
    AttachmentApiService,
    ClientMetaService,
    DownloadActivityMediaService,
    PublisherSearchModalService,
    DateRangeModalService,
    JsonLdService,
    AuthRedirectService,
    SubscriptionService,
    RecentSubscriptionsService,
    ReportService,
    GroupMembershipService,
    IsTenantService,
  ],
})
export class CommonModule {}
