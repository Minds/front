import { AbbrPipe } from './abbr';
import { DomainPipe } from './domain';
import { TagsPipe } from './tags';
import { SanitizePipe } from './sanitize';
import { SafePipe } from './safe';
import { ListablePipe } from './listable';
import { ExcerptPipe } from './excerpt';

export const MINDS_PIPES = [ AbbrPipe, DomainPipe, TagsPipe, SanitizePipe, SafePipe, ListablePipe, ExcerptPipe ];
