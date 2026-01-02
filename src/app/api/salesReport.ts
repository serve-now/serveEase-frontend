import { instance } from '@/lib/axios';
import {
  Period,
  SalesReportParams,
  SalesReportResponseSchema,
} from '@/lib/schemas';
import { validate } from '@/app/api/validate';
import { captureDomainError } from '@/lib/sentry/capture';

export async function getSalesReport(params: SalesReportParams) {
  const periodTypeMap: Record<Period, string> = {
    day: 'DAILY',
    week: 'WEEKLY',
    month: 'MONTHLY',
  };

  const periodType = periodTypeMap[params.period];

  const { data } = await instance.get('/reports/sales', {
    params: {
      to: params.to,
      from: params.from,
      storeId: params.storeId,
      periodType,
    },
  });

  try {
    return validate(data, SalesReportResponseSchema);
  } catch (e) {
    captureDomainError({
      error: e,
      feature: 'sales',
      step: 'zod-parse',
      level: 'error',
      context: {
        storeId: params.storeId,
        from: params.from,
        to: params.to,
        period: params.period,
        periodType,
      },
    });

    throw e;
  }
}
