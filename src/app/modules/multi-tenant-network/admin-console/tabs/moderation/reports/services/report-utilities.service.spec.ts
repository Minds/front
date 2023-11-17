import { TestBed } from '@angular/core/testing';
import { ReportUtilitiesService } from './report-utilities.service';
import {
  NsfwSubReasonEnum,
  IllegalSubReasonEnum,
  Report,
  ReportReasonEnum,
  SecuritySubReasonEnum,
} from '../../../../../../../../graphql/generated.engine';

describe('ReportUtilitiesService', () => {
  let service: ReportUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportUtilitiesService],
    });

    service = TestBed.inject(ReportUtilitiesService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  // NSFW

  it('should return correct reason label for NSFW and Nudity subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Nsfw,
      nsfwSubReason: NsfwSubReasonEnum.Nudity,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('NSFW (Nudity)');
  });

  it('should return correct reason label for NSFW and Pornography subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Nsfw,
      nsfwSubReason: NsfwSubReasonEnum.Pornography,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('NSFW (Pornography)');
  });

  it('should return correct reason label for NSFW and Profanity subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Nsfw,
      nsfwSubReason: NsfwSubReasonEnum.Profanity,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('NSFW (Profanity)');
  });

  it('should return correct reason label for NSFW and ViolenceGore subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Nsfw,
      nsfwSubReason: NsfwSubReasonEnum.ViolenceGore,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'NSFW (Violence or gore)'
    );
  });

  it('should return correct reason label for NSFW and RaceReligionGender subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Nsfw,
      nsfwSubReason: NsfwSubReasonEnum.RaceReligionGender,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'NSFW (Race, religion or gender)'
    );
  });

  it('should return correct reason label for NSFW and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Nsfw,
      nsfwSubReason: null,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('NSFW');
  });

  // Illegal

  it('should return correct reason label for Illegal and AnimalAbuse subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: IllegalSubReasonEnum.AnimalAbuse,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Illegal (Animal abuse)'
    );
  });

  it('should return correct reason label for Illegal and Extortion subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: IllegalSubReasonEnum.Extortion,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Illegal (Extortion)'
    );
  });

  it('should return correct reason label for Illegal and Fraud subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: IllegalSubReasonEnum.Fraud,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('Illegal (Fraud)');
  });

  it('should return correct reason label for Illegal and MinorsSexualization subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: IllegalSubReasonEnum.MinorsSexualization,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Illegal (Sexualization of minors)'
    );
  });

  it('should return correct reason label for Illegal and RevengePorn subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: IllegalSubReasonEnum.RevengePorn,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Illegal (Revenge porn)'
    );
  });

  it('should return correct reason label for Illegal and Terrorism subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: IllegalSubReasonEnum.Terrorism,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Illegal (Terrorism)'
    );
  });

  it('should return correct reason label for Illegal and Trafficking subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: IllegalSubReasonEnum.Trafficking,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Illegal (Trafficking)'
    );
  });

  it('should return correct reason label for Illegal and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: null,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('Illegal');
  });

  // Security

  it('should return correct reason label for Security and HackedAccount subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Security,
      securitySubReason: SecuritySubReasonEnum.HackedAccount,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Security (Hacked account)'
    );
  });

  it('should return correct reason label for Security and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.Security,
      securitySubReason: null,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('Security');
  });

  // Non-subreason reasons

  it('should return correct reason label for Harassment and no subcategory', () => {
    const report: Report = { reason: ReportReasonEnum.Harassment } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('Harassment');
  });

  it('should return correct reason label for Impersonation and no subcategory', () => {
    const report: Report = { reason: ReportReasonEnum.Impersonation } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('Impersonation');
  });

  it('should return correct reason label for InauthenticEngagement and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.InauthenticEngagement,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Inauthentic engagement'
    );
  });

  it('should return correct reason label for IncitementToViolence and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.IncitementToViolence,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Incitement to violence'
    );
  });

  it('should return correct reason label for IntellectualPropertyViolation and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.IntellectualPropertyViolation,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Intellectual property violation'
    );
  });

  it('should return correct reason label for Malware and no subcategory', () => {
    const report: Report = { reason: ReportReasonEnum.Malware } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('Malware');
  });

  it('should return correct reason label for PersonalConfidentialInformation and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.PersonalConfidentialInformation,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Personal/confidential information'
    );
  });

  it('should return correct reason label for Malware and no subcategory', () => {
    const report: Report = { reason: ReportReasonEnum.Spam } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('Spam');
  });

  it('should return correct reason label for ActivityPubReport and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.ActivityPubReport,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe('ActivityPub report');
  });

  it('should return correct reason label for ViolatesPremiumContentPolicy and no subcategory', () => {
    const report: Report = {
      reason: ReportReasonEnum.ViolatesPremiumContentPolicy,
    } as Report;
    expect(service.getReasonLabelFromReport(report)).toBe(
      'Violates premium content policy'
    );
  });

  it('should return correct reason label for other reasons and no subcategory', () => {
    const report: Report = { reason: 9999 } as any;
    expect(service.getReasonLabelFromReport(report)).toBe('Other reason');
  });
});
