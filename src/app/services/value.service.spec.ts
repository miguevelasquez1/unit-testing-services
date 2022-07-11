import { TestBed } from '@angular/core/testing';

import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService],
    });
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    it('should return "My value"', () => {
      expect(service.getValue()).toBe('My value');
    });
  });

  describe('Tests for setValue', () => {
    it('should change the value', () => {
      expect(service.getValue()).toBe('My value');
      service.setValue('changed');
      expect(service.getValue()).toBe('changed');
    });
  });

  describe('Tests for getPromiseValue', () => {
    it('should return "promise value" from promise with then', (doneFn) => {
      service.getPromiseValue().then((value) => {
        expect(value).toBe('promise value');
        doneFn();
      });
    });

    it('should return "promise value" from promise using async/await', async () => {
      const res = await service.getPromiseValue();
      expect(res).toBe('promise value');
    });
  });

  describe('Tests for getObservableValue', () => {
    it('should return "observable value"', (doneFn) => {
      service.getObservableValue().subscribe((value) => {
        expect(value).toBe('observable value');
        doneFn();
      });
    });
  });
});
