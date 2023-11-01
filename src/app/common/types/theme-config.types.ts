import { MultiTenantColorScheme } from '../../../graphql/generated.engine';

/** Theme config object */
export type ThemeConfig = Partial<{
  color_scheme: MultiTenantColorScheme;
  primary_color: string;
}>;
