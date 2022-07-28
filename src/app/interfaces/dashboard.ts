export interface Response {
  status: string;
  dashboard: Dashboard;
}

export interface Dashboard {
  category: string;
  description?: string;
  timespan: string;
  timespans: Timespan[];
  metric: string;
  metrics: Metric[];
  filter: string[];
  filters: Filter[];
}

export interface Filter {
  id: string;
  label: string;
  options: Option[];
  description?: string;
  expanded?: boolean;
}

export interface Option {
  id: string;
  label: string;
  available?: boolean;
  selected?: boolean;
  description?: string;
  interval?: string;
  comparison_interval?: number;
  from_ts_ms?: number;
  from_ts_iso?: string;
}

export interface Metric {
  id: string;
  label: string;
  permissions?: string[];
  summary?: Summary;
  unit?: string;
  description?: string;
  visualisation: Visualisation | null;
  value?: number;
}
export interface Summary {
  current_value: number;
  comparison_value: number;
  comparison_interval: number;
  comparison_positive_inclination: boolean;
}

export interface Visualisation {
  type: string;
  segments?: Buckets[];
  buckets?: Bucket[];
  columns?: Array<any>;
}

export interface Buckets {
  buckets: Bucket[];
}
export interface Bucket {
  key: number | string;
  date?: string;
  value?: number;
  values?: {};
}

export interface Timespan {
  id: string;
  label: string;
  interval: string;
  comparison_interval?: number;
  from_ts_ms: number;
  from_ts_iso: string;
  selected?: boolean;
}

export interface UserState {
  category: string;
  description?: string;
  timespan: string;
  timespans: Timespan[];
  metric: string;
  metrics: Metric[];
  filter?: string[];
  filters?: Filter[];
  loading: boolean;
}

export interface DataTab {
  id: string;
  label: string;
  value?: string | number;
  unit?: string;
  delta?: number;
  hasChanged?: boolean;
  positiveTrend?: boolean;
  description?: string;
  isLocalCurrency?: boolean;
  routerLink?: string;
}
