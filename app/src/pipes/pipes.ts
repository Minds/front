import { Type } from 'angular2/angular2';
import { DomainPipe } from './domain';
import { TagsPipe } from './tags';
import { SanitizePipe } from './sanitize';

export const MINDS_PIPES: Type[] = [ DomainPipe, TagsPipe, SanitizePipe ];
