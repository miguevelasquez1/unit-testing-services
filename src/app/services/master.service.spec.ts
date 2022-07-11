import { TestBed } from '@angular/core/testing';

import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let valueServiceSpy: jasmine.SpyObj<ValueService>;
  let masterService: MasterService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [MasterService, { provide: ValueService, useValue: spy }],
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(
      ValueService
    ) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  // it('should return "My value" from the real servie', () => {
  //   const valueService = new ValueService();
  //   const masterService = new MasterService(valueService);
  //   expect(masterService.getValue()).toBe('My value');
  // });

  // it('should return "other value from the fake service', () => {
  //   const fakeValueService = new FakeValueService();
  //   const masterService = new MasterService(
  //     fakeValueService as unknown as ValueService
  //   );
  //   expect(masterService.getValue()).toBe('fake value');
  // });

  // it('should return "fake from obj" from the fake object', () => {
  //   const fake = { getValue: () => 'fake from obj' };
  //   const masterService = new MasterService(fake as ValueService);
  //   expect(masterService.getValue()).toBe('fake from obj');
  // });

  it('should call to getValue from ValueService', () => {
    // const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    valueServiceSpy.getValue.and.returnValue('fake value');
    expect(masterService.getValue()).toBe('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
