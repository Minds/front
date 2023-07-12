import { TestBed } from '@angular/core/testing';
import { OnboardingV5CompletionStorageService } from './onboarding-v5-completion-storage.service';

describe('OnboardingV5CompletionStorageService', () => {
  let service: OnboardingV5CompletionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnboardingV5CompletionStorageService],
    });
    service = TestBed.inject(OnboardingV5CompletionStorageService);

    // Mock localStorage methods
    const store: { [key: string]: string } = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        store[key] = value;
      }
    );
  });

  it('should set an item as completed in localStorage', () => {
    const guid = '123';
    service.setAsCompleted(guid);
    const storageKey = `onboarding-v5-completed-${guid}`;
    expect(localStorage.setItem).toHaveBeenCalledWith(storageKey, '1');
  });

  it('should check if an item is completed in localStorage', () => {
    const guid = '123';
    const storageKey = `onboarding-v5-completed-${guid}`;
    localStorage.setItem(storageKey, '1');
    expect(service.isCompleted(guid)).toBe(true);
  });

  it('should check if an item is not completed in localStorage', () => {
    const guid = '123';
    const storageKey = `onboarding-v5-completed-${guid}`;
    localStorage.removeItem(storageKey);
    expect(service.isCompleted(guid)).toBe(false);
  });
});
