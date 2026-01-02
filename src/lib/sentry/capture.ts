import * as Sentry from '@sentry/nextjs';

type Level = 'error' | 'warning' | 'info';
type Feature = 'payment' | 'order' | 'sales' | 'api';

export function captureDomainError(params: {
  error: unknown;
  feature: Feature;
  step?: string;
  action?: string;
  level?: Level;
  context?: Record<string, unknown>;
}) {
  const { error, feature, step, action, level = 'error', context } = params;

  Sentry.withScope((scope) => {
    scope.setTag('feature', feature);
    if (step) scope.setTag('step', step);
    if (action) scope.setTag('action', action);

    scope.setLevel(level);

    if (context) scope.setContext(feature, context);

    Sentry.captureException(error);
  });
}
