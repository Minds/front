import { UserCard } from './user/user';
import { VideoCard } from './object/video/video';
import { ImageCard } from './object/image/image';
import { AlbumCard } from './object/album/album';
import { Activity } from './activity/activity';
import { CommentCard } from './comment/comment';
import { BlogCard} from '../../plugins/blog/card/card';
import { GroupsCard } from '../../plugins/Groups/card/card';

export { UserCard } from './user/user';
export { VideoCard } from './object/video/video';
export { ImageCard } from './object/image/image';
export { AlbumCard } from './object/album/album';
export const CARDS: any[] = [ UserCard, VideoCard, ImageCard, AlbumCard, Activity, CommentCard, BlogCard, GroupsCard ];
