/**
* Activity Object
*/
export interface MindsActivityObject {
	activity : Array<any>;
}

export interface MindsBlogEntity {
	guid : string,
	title : string,
	description : string,
	ownerObj : any
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
}

export interface MindsGroup {
  guid : string,
  name : string,
  banner : boolean
}
