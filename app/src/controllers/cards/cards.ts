import { Type } from 'angular2/angular2';
import { UserCard } from './user/user';
import { VideoCard } from './object/video/video';
import { ImageCard } from './object/image/image';
import { AlbumCard } from './object/album/album';
import { Activity } from './activity/activity';
import { CommentCard } from './comment/comment';

export { UserCard } from './user/user';
export { VideoCard } from './object/video/video';
export { ImageCard } from './object/image/image';
export { AlbumCard } from './object/album/album';
export const CARDS: Type[] = [ UserCard, VideoCard, ImageCard, AlbumCard, Activity, CommentCard ];
