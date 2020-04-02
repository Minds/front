import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpdeskDashboardComponent } from './dashboard/dashboard.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionCreatorComponent } from './creator/question/creator.component';
import { CategoryCreatorComponent } from './creator/category/creator.component';
import { LegacyModule } from '../../modules/legacy/legacy.module';
import { RelatedQuestionsComponent } from './questions/related/related.component';
import { SearchQuestionsComponent } from './questions/search/search.component';
import { SuggestedQuestionsComponent } from './questions/suggested/suggested.component';
import { AllHelpdeskDashboardComponent } from './dashboard/all.component';

const routes: Routes = [
  {
    path: 'help',
    component: HelpdeskDashboardComponent,
    data: {
      title: 'Help Desk',
      description: 'Everything you need to know about Minds',
      ogImage: '/assets/photos/balloon.jpg',
    },
  },
  {
    path: 'help/category/edit/:uuid',
    component: CategoryCreatorComponent,
    data: {
      title: 'Help Desk > Edit Category',
    },
  },
  {
    path: 'help/question/edit/:uuid',
    component: QuestionCreatorComponent,
    data: {
      title: 'Help Desk > Edit Question',
    },
  },
  { path: 'help/question/:uuid', component: QuestionsComponent },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LegacyModule,
  ],
  exports: [],
  declarations: [
    HelpdeskDashboardComponent,
    QuestionsComponent,
    CategoryCreatorComponent,
    QuestionCreatorComponent,
    RelatedQuestionsComponent,
    SearchQuestionsComponent,
    SuggestedQuestionsComponent,
    AllHelpdeskDashboardComponent,
  ],
  providers: [],
})
export class HelpdeskModule {}
