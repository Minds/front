/**
* Activity Object
*/
import { WireRewardsStruc } from '../modules/wire/interfaces/wire.interfaces';

export interface MindsActivityObject {
	activity : Array<any>;
	pinned : Array<any>;
}

export interface MindsBlogEntity {
	guid : string;
	title : string;
	description : string;
    ownerObj : any;
    spam ?: boolean;
    deleted ?: boolean;
    paywall ?: boolean;
    wire_threshold ?: any;
    mature?: boolean;
    slug ?: string;
    route ?: string;
}

export interface Message {

}

export interface KeyVal {
	key: string;
	value: any;
}

export interface MindsUser {
	guid : string;
	name : string;
	username : string;
	chat ?: boolean;
	icontime : number;
	blocked ?: boolean;
	carousels ?: any[]|boolean;
	city ?: string;
	social_profiles ?: KeyVal[];
	wire_rewards ?: WireRewardsStruc;
	spam ?: boolean;
	deleted ?: boolean;
	banned ?: any;
	pinned_posts ?: Array<string>
}

export interface MindsGroup {
  guid : string;
  name : string;
  banner : boolean;
}
