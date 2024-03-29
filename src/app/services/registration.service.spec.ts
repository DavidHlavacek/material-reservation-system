// src/app/services/registration.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistrationService]
    });
    service = TestBed.inject(RegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should register a user and return success', () => {
    const mockUser = { email: 'test@example.com', name: 'John Doe', barcode: '1234567890' };
    service.registerEmail(mockUser.email, mockUser.name, mockUser.barcode).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(service.apiUrl + '/register');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
