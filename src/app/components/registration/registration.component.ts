import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../services/registration.service';
import { EmailService } from '../../services/email.service';




@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [FormBuilder, HttpClient, RegistrationService, EmailService],
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

export class RegistrationComponent {
  registrationForm: FormGroup;
  isRegistered: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private emailService: EmailService
  ) {
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

        // Check if email address is from nhl
        if (!this.isValidEmailDomain(email)) {
          alert('Access denied. Please use a valid NHL Stenden email address.');
          return;
        }

        // Check if email is already registered
        this.registrationService.checkEmailExistence(email).subscribe(
          (response: any) => {
            if (response.exists) {
              alert('Email already registered');
            } else {
              // Save email to the database
              const barcode = this.generateUniqueBarcode();

              this.registrationService.registerEmail(email, barcode).subscribe(
                () => {
                  this.isRegistered = true;
                  
                  // Generate barcode to the email
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

  generateUniqueBarcode(): number {
    // barcode generation?
    return 123456789;
  }

  async sendBarcodeByEmail(email: string, barcode: number) {
    // add barcode sending
    await this.emailService.sendBarcode(email, barcode).subscribe();
  }

  isValidEmailDomain(email: string): boolean {
    // check if email is from nhl
    return email.endsWith('@student.nhlstenden.com') || email.endsWith('@nhlstenden.com');
  }
}