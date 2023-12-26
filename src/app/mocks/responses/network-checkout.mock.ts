import {
  AddOn,
  CheckoutPageKeyEnum,
  CheckoutTimePeriodEnum,
  Plan,
  Summary,
} from '../../../graphql/generated.engine';

export const mockPlan: Plan = {
  __typename: 'Plan',
  description: 'mockDescription',
  id: 'mockId',
  monthlyFeeCents: 1000,
  name: 'mockName',
  oneTimeFeeCents: 5000,
  perks: ['mockPerk1', 'mockPerk2'],
  perksTitle: 'mockPerksTitle',
};

export const mockAddOns: AddOn[] = [
  {
    __typename: 'AddOn',
    description: 'mockDescription1',
    id: 'mockId1',
    monthlyFeeCents: 1000,
    name: 'mockName1',
    oneTimeFeeCents: 5000,
    inBasket: true,
    perks: ['perk1', 'perk2'],
    perksTitle: 'Features',
  },
  {
    __typename: 'AddOn',
    description: 'mockDescription2',
    id: 'mockId2',
    monthlyFeeCents: 2000,
    name: 'mockName2',
    oneTimeFeeCents: 6000,
    inBasket: false,
    perks: ['perk1', 'perk2'],
    perksTitle: 'Features',
  },
];

export const mockSummary: Summary = {
  __typename: 'Summary',
  totalInitialFeeCents: 100000,
  totalMonthlyFeeCents: 200000,
  planSummary: {
    __typename: 'PlanSummary',
    id: 'mockPlanId',
    monthlyFeeCents: 1000,
    name: 'mockPlanName',
    oneTimeFeeCents: 5000,
  },
  addonsSummary: [
    {
      __typename: 'AddOn',
      description: 'mockDescription1',
      id: 'mockAddOnId1',
      monthlyFeeCents: 1000,
      name: 'mockAddOnName1',
      oneTimeFeeCents: 5000,
      inBasket: true,
      perks: ['perk1', 'perk2'],
      perksTitle: 'Features',
    },
    {
      __typename: 'AddOn',
      description: 'mockDescription2',
      id: 'mockAddOnId2',
      monthlyFeeCents: 2000,
      name: 'mockAddOnName2',
      inBasket: true,
      perks: ['perk1', 'perk2'],
      perksTitle: 'Features',
    },
  ],
};

export const mockCheckoutPage = {
  addOns: mockAddOns,
  description: 'description',
  id: CheckoutPageKeyEnum.Addons,
  plan: mockPlan,
  summary: mockSummary,
  termsMarkdown: 'termsMarkdown',
  timePeriod: CheckoutTimePeriodEnum.Yearly,
  title: 'title',
  totalAnnualSavingsCents: 10000,
};
