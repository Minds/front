export interface Category {
  id: string;
  label: string;
  metrics?: string[]; // TODO: remove this
  permissions?: string[];
}

export interface Response {
  status: string;
  dashboard: Dashboard;
}

export interface Dashboard {
  category: string;
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
}

export interface Option {
  id: string;
  label: string;
  available?: boolean;
  selected?: boolean;
  interval?: string;
  comparison_interval?: number;
  from_ts_ms?: number;
  from_ts_iso?: string;
}

export interface Metric {
  id: string;
  label: string;
  permissions: string[];
  summary: Summary;
  visualisation: Visualisation | null;
}

export interface Summary {
  current_value: number;
  comparison_value: number;
  comparison_interval: number;
  comparison_positive_inclination: boolean;
}

export interface Visualisation {
  type: string;
  segments: Array<Buckets>;
}

export interface Buckets {
  buckets: Bucket[];
}
export interface Bucket {
  key: number;
  date: string;
  value: number;
}

export interface Timespan {
  id: string;
  label: string;
  interval: string;
  comparison_interval: number;
  from_ts_ms: number;
  from_ts_iso: string;
}

export interface UserState {
  category: string;
  timespan: string;
  timespans: Timespan[];
  metric: string;
  metrics: Metric[];
  filter: string[];
  filters: Filter[];
  loading: boolean;
}
