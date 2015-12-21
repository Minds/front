import { Type } from 'angular2/angular2';
import { AbbrPipe } from './abbr';
import { DomainPipe } from './domain';
import { TagsPipe } from './tags';
import { SanitizePipe } from './sanitize';

export const MINDS_PIPES: Type[] = [ AbbrPipe, DomainPipe, TagsPipe, SanitizePipe ];
