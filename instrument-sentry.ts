import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://7998981a581a2fb91a13a2cbf192fd1d@o339296.ingest.us.sentry.io/1875291",
  integrations: [ nodeProfilingIntegration() ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
});
