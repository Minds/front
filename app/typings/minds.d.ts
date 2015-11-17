// Type definitions for Minds
interface Minds{
 LoggedIn : boolean;
 Admin ?: boolean;
 user: any;
 wallet : any;
 navigation: MindsNavigation | any;
 cdn_url: string;
 site_url: string;
 notifications_count: number;
}

interface MindsNavigation {
  topbar: any,
  sidebar: any
}

interface Window {
	Minds : Minds;
	componentHandler : any;
  ga : any;
}
declare var window:Window;
