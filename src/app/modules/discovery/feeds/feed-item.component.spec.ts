import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoveryFeedItemComponent } from './feed-item.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';
import { ChangeDetectorRef } from '@angular/core';

describe('DiscoveryFeedItemComponent', () => {
  let comp: DiscoveryFeedItemComponent;
  let fixture: ComponentFixture<DiscoveryFeedItemComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        DiscoveryFeedItemComponent,
        MockComponent({
          selector: 'm-publisherCard',
          inputs: ['publisher'],
          outputs: [],
        }),
        MockComponent({
          selector: 'm-activity',
          inputs: ['entity', 'displayOptions', 'slot'],
          outputs: ['deleted'],
        }),
      ],
      providers: [
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        ChangeDetectorRef,
      ],
    });

    fixture = TestBed.createComponent(DiscoveryFeedItemComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });
});
