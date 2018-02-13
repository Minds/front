import { Client } from '../../services/api';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';
import { Session } from '../../services/session';
@Component({
  moduleId: module.id,
  selector: 'minds-rewards-component',
  templateUrl: 'rewards.html'
})
export class RewardsComponent {
  paramsSubscription: Subscription;
  uuid: string;
  requiresTShirtSize: boolean;
  requiresCellPhone: boolean;
  rewards: any;
  name: string;
  loggedIn: boolean;
  tshirtSize: string;
  private cellPhoneNumber: string;
  address: string;
  loading: boolean = true;
  inProgress: boolean = false;

  tshirtSizes: Array<string> = [
    'Small',
    'Medium',
    'Large',
    'Extra Large'
  ];

  constructor(private session: Session, private client: Client, private route: ActivatedRoute, private router: Router, private title: Title) {
    if (localStorage.getItem('redirect'))
      localStorage.removeItem('redirect');

    this.loggedIn = this.session.isLoggedIn();

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['uuid']) {
        this.uuid = params['uuid'];
      }
    });

    this.client.get('api/v1/rewards/data', { uuid: this.uuid }).then(
      (res: any) => {
        this.loading = false;
        if (res.hasOwnProperty('valid') && !res.valid) {
          this.router.navigate(['/']);
        } else {
          this.requiresTShirtSize = res.requiresTShirtSize;
          this.requiresCellPhone = res.requiresCellPhone;
          this.rewards = res.rewards;
          this.name = res.name;
        }
      }
    );
  }

  ngOnInit() {
    this.title.setTitle("Claim your Rewards");
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  onClaim() {
    if (this.inProgress)
      return;
    this.inProgress = true;
    const options = {
      'uuid': this.uuid,
      'user_guid': this.session.getLoggedInUser().guid,
      'tshirtSize': this.tshirtSize,
      'address': this.address
    };
    this.client.post('api/v1/rewards/claim', options).then((res) => {
      alert('Thank you. Your rewards have been claimed.');
      this.router.navigate(['/newsfeed']);
    }).catch(error => {
      this.inProgress = false;
      console.error('error! ', error);
    });
  }

  onLogin() {
    localStorage.setItem('redirect', '/claim-rewards/' + this.uuid);
    this.router.navigate(['/login']);
  }
}
