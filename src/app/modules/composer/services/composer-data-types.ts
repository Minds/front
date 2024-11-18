import { ActivityEntity } from '../../newsfeed/activity/activity.service';
import { Supermind } from '../../supermind/supermind.types';
import { SupermindComposerPayloadType } from '../components/popup/supermind/superminds-creation.service';
import { Attachment } from './attachment.service';
import { ActivityContainer } from './audience.service';
import { RichEmbed } from './rich-embed.service';
import { FileUpload } from './uploader.service';
import { VideoPoster } from './video-poster.service';

/**
 * Message value type
 */
export type MessageSubjectValue = string;

/**
 * Title value type
 */
export type TitleSubjectValue = string | null;

/**
 * Rich embed title value type
 */
export type RichEmbedTitleSubjectValue = string | null;

/**
 * Remind value type
 */
export type RemindSubjectValue = ActivityEntity | null;

/**
 * Attachment value type
 */
export type AttachmentSubjectValue = FileUpload[] | Attachment[] | null;

/**
 * Attachment resolved object value (used for payload)
 */
export type AttachmentsMetadataMappedValue = Attachment[] | null;

/**
 * Audio thumbnail value type
 */
export type AudioThumbnailSubjectValue = string | null;

/**
 * Rich embed value type
 */
export type RichEmbedSubjectValue = RichEmbed | string | null;

/**
 * Rich embed resolved object value (used for payload)
 */
export type RichEmbedMetadataMappedValue = RichEmbed | null;

/**
 * NSFW value type
 */
export type NsfwSubjectValue = Array<number>;

/**
 * post to permaweb value type
 */
export type PostToPermawebSubjectValue = boolean;

/**
 * Monetization value type
 */
export type MonetizationSubjectValue = {
  type?: 'tokens' | 'money';
  min?: number;
  support_tier?: {
    urn: string;
    expires?: number;
    usd?: number;
    has_tokens?: boolean;
  };
} | null;

/**
 * Pending monetization value type
 */
export type PendingMonetizationSubjectValue = {
  type: 'plus' | 'membership' | 'custom';
  name?: string;
  support_tier: {
    urn: string;
    expires?: number;
    usd?: number;
    has_tokens?: boolean;
  };
} | null;

/**
 * Tags value type
 */
export type TagsSubjectValue = Array<string>;

/**
 * Schedule value type
 */
export type ScheduleSubjectValue = number | null;

/**
 * Access ID value type
 */
export type AccessIdSubjectValue = string;

/**
 * License value type
 */
export type LicenseSubjectValue = string;

/**
 * Supermind request value type
 */
export type SupermindRequestSubjectValue = SupermindComposerPayloadType | null;

/**
 * Supermind reply value type
 */
export type SupermindReplySubjectValue = Supermind | null;

/**
 * Site membership guids subject value
 */
export type SiteMembershipGuidsSubjectValue = string[] | [-1] | null;

/**
 * The size of the composer modal
 */
export type ComposerSize = 'compact' | 'full';

/**
 * Thumbnail image for site membership posts
 */
export interface PaywallThumbnail {
  url: string;
  file?: File;
  fileBase64?: string;
}

/**
 * Payload data object. Used to build the DTO
 */
export interface Data {
  message: MessageSubjectValue;
  title: TitleSubjectValue;
  richEmbedTitle: RichEmbedTitleSubjectValue;
  nsfw: NsfwSubjectValue;
  monetization: MonetizationSubjectValue;
  tags: TagsSubjectValue;
  schedule: ScheduleSubjectValue;
  accessId: AccessIdSubjectValue;
  license: LicenseSubjectValue;
  attachmentGuids: AttachmentsMetadataMappedValue;
  richEmbed: RichEmbedMetadataMappedValue;
  paywallThumbnail: PaywallThumbnail;
  audioThumbnail: AudioThumbnailSubjectValue;
  postToPermaweb: PostToPermawebSubjectValue;
  remind: RemindSubjectValue;
  supermindRequest: SupermindRequestSubjectValue;
  supermindReply: SupermindReplySubjectValue;
  siteMembershipGuids: SiteMembershipGuidsSubjectValue;
  container: ActivityContainer;
}
