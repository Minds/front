import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { HomepageV3Module } from '../homepage-v3/homepage-v3.module';
import { HomepageV3Component } from '../homepage-v3/homepage-v3.component';

const routes: Routes = [
  {
    path: 'about',
    component: HomepageV3Component,
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
    HomepageV3Module,
  ],
})
export class AboutModule {}
