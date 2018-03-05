import { AbbrPipe } from './abbr';
import { DomainPipe } from './domain';
import { TagsPipe } from './tags';
import { SanitizePipe } from './sanitize';
import { SafePipe } from './safe';
import { ListablePipe } from './listable';
import { ExcerptPipe } from './excerpt';
import { TokenPipe } from './token.pipe';
import { UtcDatePipe } from './utcdate';
import { AddressExcerptPipe } from './address-excerpt';

export const MINDS_PIPES = [ AbbrPipe, DomainPipe, TagsPipe, SanitizePipe, SafePipe, ListablePipe, ExcerptPipe, TokenPipe, UtcDatePipe, AddressExcerptPipe ];
