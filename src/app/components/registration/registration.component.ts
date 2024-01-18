// registration.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  register() {
    const form = this.registrationForm;

    if (form && form.valid) {
      const emailControl = form.get('email');

      if (emailControl) {
        const email = emailControl.value;

        // Check if the email address contains the allowed domain
        if (!this.isValidEmailDomain(email)) {
          alert('Access denied. Please use a valid NHL Stenden email address.');
          return;
        }

        // Check if the email is already registered
        this.http.get(`/api/check-email?email=${email}`).subscribe(
          (response: any) => {
            if (response.exists) {
              alert('Email already registered');
            } else {
              // Save the email to the database
              this.http.post('/api/register', { email }).subscribe(
                () => {
                  alert('Congratulations! You are now registered.');

                  // Generate and send a unique barcode to the email address
                  const barcode = this.generateUniqueBarcode();
                  this.sendBarcodeByEmail(email, barcode);
                },
                error => {
                  console.error('Error saving email to the database:', error);
                }
              );
            }
          },
          error => {
            console.error('Error checking email existence:', error);
          }
        );
      }
    }
  }

  generateUniqueBarcode(): string {
    // barcode generation?
    return '123456789';
  }

  sendBarcodeByEmail(email: string, barcode: string) {
    // add barcode sending
    console.log(`Sending barcode ${barcode} to ${email}`);
  }

  isValidEmailDomain(email: string): boolean {
    // check if email is from nhl
    return email.endsWith('@student.nhlstenden.com') || email.endsWith('@nhlstenden.com');
  }
}
