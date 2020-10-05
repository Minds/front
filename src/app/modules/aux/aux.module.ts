import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { AuxComponent } from './aux.component';
import { AuxPrivacyComponent } from './pages/privacy/privacy.component';
import { MarketingModule } from '../marketing/marketing.module';
import { AuxDmcaComponent } from './pages/dmca/dmca.component';
import { AuxTermsComponent } from './pages/terms/terms.component';
import { AuxRightsComponent } from './pages/rights/rights.component';
import { AuxContactComponent } from './pages/contact/contact.component';
import { AuxMonetizationTermsComponent } from './pages/monetization-terms/monetization-terms.component';

const AUX_ROUTES: Routes = [
  {
    path: '',
    component: AuxComponent,
    children: [
      {
        path: '',
        redirectTo: 'privacy',
      },
      {
        path: 'privacy',
        component: AuxPrivacyComponent,
        data: {
          title: 'Privacy Policy',
          description:
            'This privacy policy is made available for remix under a Creative Commons Sharealike license. Your privacy is important to Minds, Inc. ...',
          ogImage: '/assets/product-pages/pro/pro-4.jpg',
        },
      },
      {
        path: 'dmca',
        component: AuxDmcaComponent,
        data: {
          title: 'DMCA',
          description:
            'If you believe that material available on our sites infringes on your copyright(s), please notify us by providing a DMCA notice...',
          ogImage: '/assets/product-pages/pay/pay-3.jpg',
        },
      },
      {
        path: 'terms',
        component: AuxTermsComponent,
        data: {
          title: 'Terms of Service',
          description:
            'We (the people who work with Minds) create free and open source software and run the Minds.com social network...',
          ogImage: '/assets/product-pages/pro/pro-1.jpg',
        },
      },
      {
        path: 'contact',
        component: AuxContactComponent,
        data: {
          title: 'Contact',
          description:
            'Contact details for press, general enquiries and support, copyright and DMCA, security and vulnerabilities',
          ogImage: '/assets/product-pages/nodes/nodes-2.jpg',
        },
      },
      {
        path: 'billofrights',
        component: AuxRightsComponent,
        data: {
          title: 'Bill of Rights',
          description:
            'Minds is officially adopting the Manila Principles On Intermediary Liability, a digital bill of rights...',
          ogImage: '/assets/product-pages/token/token-2.jpg',
        },
      },
      {
        path: 'monetization-terms',
        component: AuxMonetizationTermsComponent,
        data: {
          title: 'Minds Pro Terms of Service',
          description:
            'If  you  have  been  invited  to  or  joined  Minds  Pro  ("Minds Pro"),  and  your  participation  in  Minds Pro has  not  been  terminated,  then  the  following  terms  shall  apply.',
          ogImage: '/assets/product-pages/pro/pro-1.jpg',
        },
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(AUX_ROUTES),
    MarketingModule,
  ],
  declarations: [
    AuxComponent,
    AuxPrivacyComponent,
    AuxDmcaComponent,
    AuxTermsComponent,
    AuxRightsComponent,
    AuxContactComponent,
    AuxMonetizationTermsComponent,
  ],
})
export class AuxModule {}
