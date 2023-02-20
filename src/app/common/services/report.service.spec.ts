import { configMock } from '../../../tests/config-mock-service.spec';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(() => {
    service = new ReportService(configMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should get reasons and subreasons', () => {
    const configValues = [
      {
        value: '1',
        hasMore: true,
        reasons: [{ value: '1' }],
      },
      { value: '3' },
      { value: '4' },
      { value: '5' },
      { value: '18' },
    ];

    (service as any).configs.get.and.returnValue(configValues);

    expect(service.reasons).toEqual([
      Object({
        value: '1',
        label: 'Illegal',
        description: '',
        hasMore: true,
        reasons: [
          Object({
            value: '1',
            reasons: undefined,
            label: 'Terrorism',
            description:
              'Advertizing or recruiting for terrorist organizations',
          }),
        ],
      }),
      Object({
        value: '3',
        reasons: undefined,
        label: 'Incitement to violence',
        description: 'Calls to violence that are imminent',
      }),
      Object({
        value: '4',
        reasons: undefined,
        label: 'Harassment',
        description:
          'Intentionally targeting someone with the intent to torment or terrorize them',
      }),
      Object({
        value: '5',
        reasons: undefined,
        label: 'Personal and confidential information',
        description:
          'Sharing or threatening to share private, personal, or confidential information about someone',
      }),
      Object({
        value: '18',
        reasons: undefined,
        label: 'Violates Premium Content policy',
        description: 'Content violates premium content policy',
      }),
    ]);
  });
});
