import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MINDS_PIPES } from "./pipes/pipes";

import { TooltipComponent } from './components/tooltip/tooltip.component';
import { FooterComponent } from './components/footer/footer.component';
import { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
import { CountryInputComponent } from './components/forms/country-input/country-input.component';
import { DateInputComponent } from './components/forms/date-input/date-input.component';
import { StateInputComponent } from './components/forms/state-input/state-input.component';
import { Scheduler } from "./components/scheduler/scheduler";
import { Modal } from "./components/modal/modal.component";
import { MindsRichEmbed } from "./components/rich-embed/rich-embed";

import { MDL_DIRECTIVES } from './directives/material';
import { AutoGrow } from "./directives/autogrow";
import { Emoji } from "./directives/emoji";
import { Hovercard } from "./directives/hovercard";
import { ScrollLock } from "./directives/scroll-lock";
import { TagsLinks } from "./directives/tags";
import { Tooltip } from "./directives/tooltip";
import { MindsAvatar } from "./components/avatar/avatar";
import { CaptchaComponent } from "./components/captcha/captcha.component";
import { Textarea } from "./components/editors/textarea.component";
import { MindsTinymce } from "./components/editors/tinymce";

import { DynamicHostDirective } from "./directives/dynamic-host.directive";
import { MindsCard } from "./components/card/card.component";
import { MindsButton } from "./components/button/button.component";
import { OverlayModalComponent } from "./components/overlay-modal/overlay-modal.component";

import { FaqComponent } from './components/faq/faq.component';
import { ChartComponent } from './components/chart/chart.component';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    MINDS_PIPES,

    TooltipComponent,
    FooterComponent,
    InfiniteScroll,
    CountryInputComponent,
    DateInputComponent,
    StateInputComponent,
    Scheduler,
    Modal,
    MindsRichEmbed,

    AutoGrow,
    Emoji,
    Hovercard,
    ScrollLock,
    TagsLinks,
    Tooltip,
    MDL_DIRECTIVES,
    MindsAvatar,
    CaptchaComponent,
    Textarea,
    MindsTinymce,

    DynamicHostDirective,
    MindsCard,
    MindsButton,

    FaqComponent,
    ChartComponent,
    OverlayModalComponent
  ],
  exports: [
    MINDS_PIPES,

    TooltipComponent,
    FooterComponent,
    InfiniteScroll,
    CountryInputComponent,
    DateInputComponent,
    StateInputComponent,
    Scheduler,
    Modal,
    MindsRichEmbed,

    AutoGrow,
    Emoji,
    Hovercard,
    ScrollLock,
    TagsLinks,
    Tooltip,
    MDL_DIRECTIVES,
    MindsAvatar,
    CaptchaComponent,
    Textarea,
    MindsTinymce,

    DynamicHostDirective,
    MindsCard,
    MindsButton,

    FaqComponent,
    ChartComponent,
    OverlayModalComponent
  ],
  entryComponents: [ ]
})

export class CommonModule {}
