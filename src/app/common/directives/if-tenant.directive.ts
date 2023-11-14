import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { IsTenantService } from '../services/is-tenant.service';

/**
 * Hide/show components based on whether they are viewed as
 * part of a tenant site or Minds.com
 *
 * Provide true (default) to only show for tenant sites
 *
 * Provide false to only show on minds.com
 */
@Directive({
  selector: '[mIfTenant]',
})
export class IfTenantDirective implements OnInit {
  showIfTenant: boolean;

  @Input() set mIfTenant(showIfTenant: boolean) {
    this.showIfTenant = showIfTenant;
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private isTenant: IsTenantService
  ) {}

  ngOnInit() {
    // By default, hide content if not tenant
    if (this.showIfTenant === undefined) {
      this.showIfTenant = true;
    }
    this.updateView(this.showIfTenant);
  }

  private updateView(showIfTenant: boolean) {
    if (
      (showIfTenant && this.isTenant.is()) ||
      (!showIfTenant && !this.isTenant.is())
    ) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
