import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GraphQLReportCreatorService } from './graphql-report-creator.service';
import {
  CreateNewReportGQL,
  CreateNewReportMutationVariables,
  IllegalSubReasonEnum,
  NsfwSubReasonEnum,
  ReportReasonEnum,
  SecuritySubReasonEnum,
} from '../../../../../graphql/generated.engine';
import { MockService } from '../../../../utils/mock';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../common/services/toaster.service';
import { of, throwError } from 'rxjs';

describe('GraphQLReportCreatorService', () => {
  let service: GraphQLReportCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GraphQLReportCreatorService,
        {
          provide: CreateNewReportGQL,
          useValue: jasmine.createSpyObj<CreateNewReportGQL>(['mutate']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(GraphQLReportCreatorService);
    (service as any).createNewReportGQL.mutate.calls.reset();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('createNewReport', () => {
    it('should create a new report', fakeAsync(() => {
      (service as any).createNewReportGQL.mutate.and.returnValue(
        of({
          data: { createNewReport: true },
        })
      );
      const variables: CreateNewReportMutationVariables = {
        entityUrn: 'urn:activity:123',
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Extortion,
      };

      service.createNewReport(variables);
      tick();

      expect((service as any).createNewReportGQL.mutate).toHaveBeenCalledWith(
        variables
      );
      expect((service as any).toaster.error).not.toHaveBeenCalled();
    }));

    it('should handle a thrown error when creating a new report', fakeAsync(() => {
      (service as any).createNewReportGQL.mutate.and.returnValue(
        throwError(() => 'Error')
      );
      const variables: CreateNewReportMutationVariables = {
        entityUrn: 'urn:activity:123',
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Extortion,
      };

      service.createNewReport(variables);
      tick();

      expect((service as any).createNewReportGQL.mutate).toHaveBeenCalledWith(
        variables
      );
      expect((service as any).toaster.error).toHaveBeenCalledWith('Error');
    }));

    it('should handle a no data coming back when creating a new report', fakeAsync(() => {
      (service as any).createNewReportGQL.mutate.and.returnValue(of(null));
      const variables: CreateNewReportMutationVariables = {
        entityUrn: 'urn:activity:123',
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Extortion,
      };

      service.createNewReport(variables);
      tick();

      expect((service as any).createNewReportGQL.mutate).toHaveBeenCalledWith(
        variables
      );
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        new Error(DEFAULT_ERROR_MESSAGE)
      );
    }));

    it('should handle a GraphQL coming back when creating a new report', fakeAsync(() => {
      (service as any).createNewReportGQL.mutate.and.returnValue(
        of({
          errors: [{ message: 'Error' }],
        })
      );
      const variables: CreateNewReportMutationVariables = {
        entityUrn: 'urn:activity:123',
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Extortion,
      };

      service.createNewReport(variables);
      tick();

      expect((service as any).createNewReportGQL.mutate).toHaveBeenCalledWith(
        variables
      );
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        new Error('Error')
      );
    }));
  });

  describe('mapLegacyReasonToEnums', () => {
    it('should map Illegal reason to a new enum', () => {
      const reasonCode: number = 1;
      const subReasonCode: number = null;
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        {
          reason: ReportReasonEnum.Illegal,
        }
      );
    });

    it('should map Illegal reason and Terrorism subreason to a new enum', () => {
      const reasonCode: number = 1;
      const subReasonCode: number = 1;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Terrorism,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Illegal reason and MinorsSexualization subreason to a new enum', () => {
      const reasonCode: number = 1;
      const subReasonCode: number = 2;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.MinorsSexualization,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Illegal reason and Extortion subreason to a new enum', () => {
      const reasonCode: number = 1;
      const subReasonCode: number = 3;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Extortion,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Illegal reason and Fraud subreason to a new enum', () => {
      const reasonCode: number = 1;
      const subReasonCode: number = 4;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Fraud,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Illegal reason and RevengePorn subreason to a new enum', () => {
      const reasonCode: number = 1;
      const subReasonCode: number = 5;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.RevengePorn,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Illegal reason and Trafficking subreason to a new enum', () => {
      const reasonCode: number = 1;
      const subReasonCode: number = 6;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Trafficking,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Illegal reason and AnimalAbuse subreason to a new enum', () => {
      const reasonCode: number = 1;
      const subReasonCode: number = 7;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.AnimalAbuse,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Nsfw reason to a new enum', () => {
      const reasonCode: number = 2;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Nsfw,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Nsfw reason and Nudity subreason to a new enum', () => {
      const reasonCode: number = 2;
      const subReasonCode: number = 1;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.Nudity,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Nsfw reason and Pornography subreason to a new enum', () => {
      const reasonCode: number = 2;
      const subReasonCode: number = 2;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.Pornography,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Nsfw reason and Profanity subreason to a new enum', () => {
      const reasonCode: number = 2;
      const subReasonCode: number = 3;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.Profanity,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Nsfw reason and ViolenceGore subreason to a new enum', () => {
      const reasonCode: number = 2;
      const subReasonCode: number = 4;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.ViolenceGore,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Nsfw reason and ViolenceGore subreason to a new enum', () => {
      const reasonCode: number = 2;
      const subReasonCode: number = 5;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.RaceReligionGender,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map IncitementToViolence reason to a new enum', () => {
      const reasonCode: number = 3;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.IncitementToViolence,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Harassment reason to a new enum', () => {
      const reasonCode: number = 4;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Harassment,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map PersonalConfidentialInformation reason to a new enum', () => {
      const reasonCode: number = 5;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.PersonalConfidentialInformation,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Impersonation reason to a new enum', () => {
      const reasonCode: number = 7;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Impersonation,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Spam reason to a new enum', () => {
      const reasonCode: number = 8;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Spam,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map IntellectualPropertyViolation reason to a new enum', () => {
      const reasonCode: number = 10;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.IntellectualPropertyViolation,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Malware reason to a new enum', () => {
      const reasonCode: number = 13;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Malware,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map InauthenticEngagement reason to a new enum', () => {
      const reasonCode: number = 16;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.InauthenticEngagement,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Security reason to a new enum', () => {
      const reasonCode: number = 17;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Security,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map Security reason with subreason HackedAccount to a new enum', () => {
      const reasonCode: number = 17;
      const subReasonCode: number = 1;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.Security,
        securitySubReason: SecuritySubReasonEnum.HackedAccount,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map ViolatesPremiumContentPolicy reason to a new enum', () => {
      const reasonCode: number = 18;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.ViolatesPremiumContentPolicy,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });

    it('should map AnotherReason reason to a new enum', () => {
      const reasonCode: number = 11;
      const subReasonCode: number = null;
      const expectedReturnValue: Omit<
        CreateNewReportMutationVariables,
        'entityUrn'
      > = {
        reason: ReportReasonEnum.AnotherReason,
      };
      expect(service.mapLegacyReasonToEnums(reasonCode, subReasonCode)).toEqual(
        expectedReturnValue
      );
    });
  });
});
