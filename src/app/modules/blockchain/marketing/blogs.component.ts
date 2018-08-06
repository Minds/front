import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';
import { MindsBlogListResponse } from '../../../interfaces/responses';

@Component({
  selector: 'm-blockchain--marketing--blogs',
  templateUrl: 'blogs.component.html'
})

export class BlockchainMarketingBlogsComponent {

  blogs = [
    { 
      guid: "871791809876131840",
      title: "How to buy MINDS tokens",
      ownerObj: {
        name: "Minds",
        username: "minds",
        guid: "100000000000000519",
      },
      thumbnail_src: window.Minds.cdn_url + 'fs/v1/banners/871791809876131840/1533585765',
      header_bg: true,
     },
     { 
       guid: "871789298595016704",
       title: "How to buy ETH on Coinbase",
       ownerObj: {
         name: "Minds",
         username: "minds",
         guid: "100000000000000519",
       },
       thumbnail_src: window.Minds.cdn_url + 'fs/v1/banners/871789298595016704/1533585765',
       header_bg: true,
     },
     {
      guid: "871787065656385536",
      title: "How to buy ETH on Gemini",
      ownerObj: {
        name: "Minds",
        username: "minds",
        guid: "100000000000000519",
       },
       thumbnail_src: window.Minds.cdn_url + 'fs/v1/banners/871787065656385536/1533585765',
       header_bg: true,
     },
     {
       guid: "871783126122799104",
       title: "How to setup your wallet with MetaMask",
       ownerObj: {
         name: "Minds",
         username: "minds",
         guid: "100000000000000519",
       },
       thumbnail_src: window.Minds.cdn_url + 'fs/v1/banners/871783126122799104/1533585765',
       header_bg: true,
     },
     {
       guid: "871784584725569536",
       title: "How to setup your wallet without MetaMask",
       ownerObj: {
         name: "Minds",
         username: "minds",
         guid: "100000000000000519",
         },
       thumbnail_src: window.Minds.cdn_url + 'fs/v1/banners/871784584725569536/1533585765',
       header_bg: true,
     },
     {
       guid: "826188573910073344",
       title: "Crypto launch, new apps, and more",
       ownerObj: {
         name: "Minds",
         username: "minds",
         guid: "100000000000000519",
       },
       thumbnail_src: window.Minds.cdn_url + 'fs/v1/banners/826188573910073344/1533585765',
       header_bg: true,
     },
   ];

    ngOnInit() {

    }
}
