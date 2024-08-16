import * as Sentry from "@sentry/node";
import { SENTRY_IGNORED_ERRORS } from "./src/app/common/services/diagnostics/sentry-ignored-errors";

Sentry.init({
  dsn: "https://bbf22a249e89416884e8d6e82392324f@o293216.ingest.us.sentry.io/5729114",
  tracesSampleRate: 1.0,
  ignoreErrors: SENTRY_IGNORED_ERRORS
});
