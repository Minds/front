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
     },
     { 
      guid: "871789298595016704",
      title: "How to buy ETH on Coinbase",
      ownerObj: {
        name: "Minds",
        username: "minds",
        guid: "100000000000000519",
       },
     },
     {
      guid: "871787065656385536",
      title: "How to buy ETH on Gemini",
      ownerObj: {
        name: "Minds",
        username: "minds",
        guid: "100000000000000519",
       },
     },
     {
      guid: "871783126122799104",
      title: "How to setup your wallet with MetaMask",
      ownerObj: {
        name: "Minds",
        username: "minds",
        guid: "100000000000000519",
       },
     },
   ];

    ngOnInit() {

    }
}
