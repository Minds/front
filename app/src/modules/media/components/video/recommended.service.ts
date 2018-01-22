import { Injectable } from '@angular/core';
import { Client } from '../../../../services/api';

@Injectable()
export class RecommendedService {
  private recommended: Array<any>;

  static _(client: Client) {
    return new RecommendedService(client);
  }

  constructor(public client: Client) {
    this.recommended = [];
  }

  public getRecommended(type: string, channel: string | number, params: any): Promise<any> {
    return this.client.get(`api/v1/media/recommended/${type}/${channel}`, params)
      .then(({ entities }) => {
        this.recommended = entities;
        return entities;
    });
  }

  public getFirstRecommended(): any {
    if(this.recommended.length > 0){
        return this.recommended[0];
      }else{
        return false;
    }
  }

}