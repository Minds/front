import { EventEmitter } from 'angular2/core';
import { Router } from 'angular2/router';
import { ScrollService } from '../../../services/ux/scroll';

export class SignupModalService{

  defaultSubtitle : string = "Sign in  to vote, comment. Earn 100+ views/day for logging  in.";
  subtitle : string = this.defaultSubtitle;
  isOpen : EventEmitter<boolean> = new EventEmitter();
  display : EventEmitter<string> = new EventEmitter();

  route : string;
  scroll_listener;

  constructor(private router : Router, public scroll : ScrollService){
    console.log('modal service constructed');
    this.initOnScroll();
  }

  private initOnScroll(){
    this.router.subscribe((route) => {
      this.route = route;
      switch(route.split('?')[0]){
        case 'register':
        case 'login':
        case 'forgot-password':
        case '':
          this.close();
          break;
        default:
          if(this.scroll_listener)
            return;
          this.scroll_listener = this.scroll.listen((e) => {
            if(this.scroll.view.scrollTop > 100){
              if(window.localStorage.getItem('hideSignupModal'))
                this.close();
              else
                this.open();
              this.scroll.unListen(this.scroll_listener);
            }
          }, 100);
      }
    });
  }

  open() : SignupModalService{
    this.isOpen.next(true);
    return this;
  }

  close() : SignupModalService{
    this.isOpen.next(false);
    this.display.next('initial');
    this.subtitle = this.defaultSubtitle;
    return this;
  }

  setSubtitle(text : string) : SignupModalService{
    this.subtitle = text;
    return this;
  }

  setDisplay(display : string) : SignupModalService{
    this.display.next(display);
    return this;
  }

}
