import { Type } from '@angular/core';

import { CityFinderForm } from './city-finder/city-finder';
import { LoginForm } from './login/login';
import { OnboardingForm } from './onboarding/onboarding';
import { RegisterForm } from './register/register';
import { FbRegisterForm } from './fb-register/fb-register';
import { DateInput } from './date-input/date-input';
import { CountryInput } from './country-input/country-input';

export const FORM_COMPONENTS: Type[] = [ CityFinderForm, LoginForm, OnboardingForm, RegisterForm, FbRegisterForm,
  DateInput, CountryInput ];
