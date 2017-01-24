var gun = window.Gun();

export class GunDB {

	read(path : string, cb : any){
		var a = path.split('.');
		return gun.get(a[0]).path(a[1]).val(cb);
	}

	write(path : string, data : any){
		var a = path.split('.');
		return gun.get(a[0]).path(a[1]).put(data);
	}
  
  static _() {
    return new GunDB;
  }
}