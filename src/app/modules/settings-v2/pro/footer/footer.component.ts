import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-settingsV2Pro__footer',
  templateUrl: './footer.component.html',
})
export class SettingsV2ProFooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  // footer: this.fb.group({
  //   title: [""],
  //   links: this.fb.array([])
  // })

  // addBlankFooterLink() {
  //   this.addFooterLink("", "");
  // }

  // addFooterLink(title, href) {
  //   const footer = <FormGroup>this.form.controls.footer;
  //   const links = <FormArray>footer.controls.links;
  //   links.push(
  //     this.fb.group({
  //       title: [title],
  //       href: [href]
  //     })
  //   );
  // }

  // setFooterLinks(links: Array<{ title: string; href: string }>) {
  //   (<FormArray>(<FormGroup>this.form.controls.footer).controls.links).clear();
  //   this.detectChanges();
  //   for (let link of links) {
  //     this.addFooterLink(link.title, link.href);
  //   }
  //   this.form.markAsDirty();
  //   this.detectChanges();
  // }
}
