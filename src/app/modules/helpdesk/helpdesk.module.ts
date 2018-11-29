import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpdeskDashboardComponent } from './components/dashboard/dashboard.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { QuestionCreatorComponent } from './components/creator/question/creator.component';
import { CategoryCreatorComponent } from './components/creator/category/creator.component';
import { LegacyModule } from '../../modules/legacy/legacy.module';

const routes: Routes = [
  { path: 'help', component: HelpdeskDashboardComponent },
  { path: 'help/category/edit/:uuid', component: CategoryCreatorComponent },
  { path: 'help/question/edit/:uuid', component: QuestionCreatorComponent },
  { path: 'help/question/:uuid', component: QuestionsComponent }
];


@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LegacyModule
  ],
  exports: [],
  declarations: [
    HelpdeskDashboardComponent,
    QuestionsComponent,
    CategoryCreatorComponent,
    QuestionCreatorComponent,
  ],
  providers: [],
})
export class HelpdeskModule {
}
