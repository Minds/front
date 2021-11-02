import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { HomepageV2Module } from '../homepage-v2/homepage.module';
import { HomepageV2Component } from '../homepage-v2/homepage-v2.component';

const routes: Routes = [
  {
    path: 'about',
    component: HomepageV2Component,
    data: {
      title: 'About',
      description:
        'Free your mind and get paid for creating content, driving traffic and referring friends. A place to have open conversations and bring people together.',
      canonicalUrl: '/about',
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    HomepageV2Module,
  ],
})
export class AboutModule {}
