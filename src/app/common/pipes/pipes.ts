import { AbbrPipe } from './abbr';
import { DomainPipe } from './domain';
import { TagsPipe } from './tags';
import { SanitizePipe } from './sanitize';
import { SafePipe, SafeStylePipe, SafeUrlPipe } from './safe';
import { ListablePipe } from './listable';
import { ExcerptPipe } from './excerpt';
import { TokenPipe } from './token.pipe';
import { UtcDatePipe } from './utcdate';
import { AddressExcerptPipe } from './address-excerpt';
import { TimediffPipe } from './timediff.pipe';
import { FriendlyDateDiffPipe } from './friendlydatediff';
import { AsyncStatePipe } from './async-state.pipe';
import { FileSizePipe } from './filesize';
import { DecodeHtmlStringPipe } from './decode-html-string';

export const MINDS_PIPES = [
  AbbrPipe,
  DomainPipe,
  TagsPipe,
  SanitizePipe,
  SafePipe,
  SafeUrlPipe,
  ListablePipe,
  ExcerptPipe,
  TokenPipe,
  UtcDatePipe,
  AddressExcerptPipe,
  TimediffPipe,
  FriendlyDateDiffPipe,
  SafeStylePipe,
  AsyncStatePipe,
  FileSizePipe,
  DecodeHtmlStringPipe,
];
