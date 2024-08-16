import * as Sentry from "@sentry/node";
import { SENTRY_IGNORED_ERRORS } from "./src/app/common/services/diagnostics/sentry-ignored-errors";

Sentry.init({
  dsn: "https://7998981a581a2fb91a13a2cbf192fd1d@o339296.ingest.us.sentry.io/1875291",
  tracesSampleRate: 1.0,
  ignoreErrors: SENTRY_IGNORED_ERRORS
});
