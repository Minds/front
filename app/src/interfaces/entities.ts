/**
* Activity Object
*/
import { WireRewardsStruc } from "../modules/wire/interfaces/wire.interfaces";

export interface MindsActivityObject {
	activity : Array<any>;
}

export interface MindsBlogEntity {
	guid : string,
	title : string,
	description : string,
    ownerObj : any,
    spam ?: boolean,
    deleted ?: boolean
}

export interface Message {

}

export interface KeyVal {
	key: string;
	value: any;
}

export interface MindsUser {
	guid : string,
	name : string,
	username : string,
	chat ?: boolean,
	icontime : number,
	blocked ?: boolean,
	carousels ?: boolean,
	city ?: string
	social_profiles ?: KeyVal[];
	wire_rewards ?: WireRewardsStruc;
	spam ?: boolean;
	deleted ?: boolean;
}

export interface MindsGroup {
  guid : string,
  name : string,
  banner : boolean
}
