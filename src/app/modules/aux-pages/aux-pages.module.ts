import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { AuxComponent } from './aux-pages.component';
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
          ogImage: '/assets/og-images/privacy-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
        },
      },
      {
        path: 'dmca',
        component: AuxDmcaComponent,
        data: {
          title: 'DMCA',
          description:
            'If you believe that material available on our sites infringes on your copyright(s), please notify us by providing a DMCA notice...',
          ogImage: '/assets/og-images/dmca-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
        },
      },
      {
        path: 'terms',
        component: AuxTermsComponent,
        data: {
          title: 'Terms of Service',
          description:
            'We (the people who work with Minds) create free and open source software and run the Minds.com social network...',
          ogImage: '/assets/og-images/terms-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
        },
      },
      {
        path: 'contact',
        component: AuxContactComponent,
        data: {
          title: 'Contact',
          description:
            'Contact details for press, general enquiries and support, copyright and DMCA, security and vulnerabilities',
          ogImage: '/assets/og-images/contact-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
        },
      },
      {
        path: 'billofrights',
        component: AuxRightsComponent,
        data: {
          title: 'Bill of Rights',
          description:
            'Minds is officially adopting the Manila Principles On Intermediary Liability, a digital bill of rights...',
          ogImage: '/assets/og-images/bill-of-rights-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
        },
      },
      {
        path: 'monetization-terms',
        component: AuxMonetizationTermsComponent,
        data: {
          title: 'Minds Monetization Terms of Service',
          description:
            'If you have been invited to or joined Minds+, Minds Pro, or monetized your free account with Stripe, (collectively the "Minds Monetization Services"), and your participation has not been terminated, then the following terms shall apply.',
          ogImage: '/assets/og-images/monetization-terms-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
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
