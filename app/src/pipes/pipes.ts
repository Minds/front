import { Type } from '@angular/core';
import { AbbrPipe } from './abbr';
import { DomainPipe } from './domain';
import { TagsPipe } from './tags';
import { SanitizePipe } from './sanitize';
import { SafePipe } from './safe';

export const MINDS_PIPES: Type[] = [ AbbrPipe, DomainPipe, TagsPipe, SanitizePipe, SafePipe ];
