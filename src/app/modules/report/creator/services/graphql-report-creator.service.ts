import { Injectable } from '@angular/core';
import {
  CreateNewReportGQL,
  CreateNewReportMutation,
  CreateNewReportMutationVariables,
  IllegalSubReasonEnum,
  NsfwSubReasonEnum,
  ReportReasonEnum,
  SecuritySubReasonEnum,
} from '../../../../../graphql/generated.engine';
import { lastValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../common/services/toaster.service';

/** Reason enum variables for create report reason mutation. */
export type CreateReportMutationReasonEnums = Omit<
  CreateNewReportMutationVariables,
  'entityUrn'
>;

/**
 * GraphQL service for creating reports - initially designed
 * to be used for tenant networks but when migrating the legacy
 * report system over in future, this service can be used for both.
 */
@Injectable({ providedIn: 'root' })
export class GraphQLReportCreatorService {
  constructor(
    private createNewReportGQL: CreateNewReportGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Create a new report.
   * @param { CreateNewReportMutationVariables } variables - The report variables.
   * @returns { Promise<boolean> } true on success.
   */
  public async createNewReport(
    variables: CreateNewReportMutationVariables
  ): Promise<boolean> {
    try {
      const result: MutationResult<CreateNewReportMutation> =
        await lastValueFrom(this.createNewReportGQL.mutate(variables));

      if (!result) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      if (result.errors?.length) {
        throw new Error(result.errors[0]?.message ?? DEFAULT_ERROR_MESSAGE);
      }

      return result.data?.createNewReport;
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
      return false;
    }
  }

  /**
   * Helper function to map legacy report reasons to the new enum system used by the
   * GraphQL endpoint.
   * @param { number } reasonCode - The legacy reason code.
   * @param { number } subReasonCode - The legacy sub reason code.
   * @returns { CreateReportMutationReasonEnums } The relative enum values.
   */
  public mapLegacyReasonToEnums(
    reasonCode: number,
    subReasonCode: number = null
  ): CreateReportMutationReasonEnums {
    let reasonString: string = `${reasonCode}`;
    if (subReasonCode) {
      reasonString += `.${subReasonCode}`;
    }

    switch (reasonString) {
      case '1':
        return {
          reason: ReportReasonEnum.Illegal,
        };
      case '1.1':
        return {
          reason: ReportReasonEnum.Illegal,
          illegalSubReason: IllegalSubReasonEnum.Terrorism,
        };
      case '1.2':
        return {
          reason: ReportReasonEnum.Illegal,
          illegalSubReason: IllegalSubReasonEnum.MinorsSexualization,
        };
      case '1.3':
        return {
          reason: ReportReasonEnum.Illegal,
          illegalSubReason: IllegalSubReasonEnum.Extortion,
        };
      case '1.4':
        return {
          reason: ReportReasonEnum.Illegal,
          illegalSubReason: IllegalSubReasonEnum.Fraud,
        };
      case '1.5':
        return {
          reason: ReportReasonEnum.Illegal,
          illegalSubReason: IllegalSubReasonEnum.RevengePorn,
        };
      case '1.6':
        return {
          reason: ReportReasonEnum.Illegal,
          illegalSubReason: IllegalSubReasonEnum.Trafficking,
        };
      case '1.7':
        return {
          reason: ReportReasonEnum.Illegal,
          illegalSubReason: IllegalSubReasonEnum.AnimalAbuse,
        };
      case '2':
        return {
          reason: ReportReasonEnum.Nsfw,
        };
      case '2.1':
        return {
          reason: ReportReasonEnum.Nsfw,
          nsfwSubReason: NsfwSubReasonEnum.Nudity,
        };
      case '2.2':
        return {
          reason: ReportReasonEnum.Nsfw,
          nsfwSubReason: NsfwSubReasonEnum.Pornography,
        };
      case '2.3':
        return {
          reason: ReportReasonEnum.Nsfw,
          nsfwSubReason: NsfwSubReasonEnum.Profanity,
        };
      case '2.4':
        return {
          reason: ReportReasonEnum.Nsfw,
          nsfwSubReason: NsfwSubReasonEnum.ViolenceGore,
        };
      case '2.5':
        return {
          reason: ReportReasonEnum.Nsfw,
          nsfwSubReason: NsfwSubReasonEnum.RaceReligionGender,
        };
      case '3':
        return {
          reason: ReportReasonEnum.IncitementToViolence,
        };
      case '4':
        return {
          reason: ReportReasonEnum.Harassment,
        };
      case '5':
        return {
          reason: ReportReasonEnum.PersonalConfidentialInformation,
        };
      case '7':
        return {
          reason: ReportReasonEnum.Impersonation,
        };
      case '8':
        return {
          reason: ReportReasonEnum.Spam,
        };
      case '10':
        return {
          reason: ReportReasonEnum.IntellectualPropertyViolation,
        };
      case '13':
        return {
          reason: ReportReasonEnum.Malware,
        };
      case '16':
        return {
          reason: ReportReasonEnum.InauthenticEngagement,
        };
      case '17':
        return {
          reason: ReportReasonEnum.Security,
        };
      case '17.1':
        return {
          reason: ReportReasonEnum.Security,
          securitySubReason: SecuritySubReasonEnum.HackedAccount,
        };
      case '18':
        return {
          reason: ReportReasonEnum.ViolatesPremiumContentPolicy,
        };
      case '11':
      default:
        return {
          reason: ReportReasonEnum.AnotherReason,
        };
    }
  }
}
