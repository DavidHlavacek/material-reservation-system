import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../services/registration.service';
import { EmailService } from '../../services/email.service';
import { BarcodeGeneratorComponent } from '../barcode-generator/barcode-generator.component';
import { BarcodeGeneratorService } from '../../services/barcode-shared.service';
import { Inject } from '@angular/core';



@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [FormBuilder, HttpClient, RegistrationService, EmailService, BarcodeGeneratorService],
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

export class RegistrationComponent implements AfterViewInit {
  registrationForm: FormGroup;
  isRegistered: boolean = false;
  inputString = '';

  @ViewChild(BarcodeGeneratorComponent) barcodeGeneratorComponent!: BarcodeGeneratorComponent;

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private emailService: EmailService,
    private barcodeGeneratorService: BarcodeGeneratorService
  ) {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }
  ngAfterViewInit(): void {
    const generatedBarcode = this.barcodeGeneratorService.generateBarcodeValue('teeeest-ss-GAHAIHEF97979');
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
            if (response && response.exists) {
              alert('Email already registered');
            } else {
              // Save email to the database
              const barcode = this.generateUniqueBarcode(email);
              const name = this.extractName(email);
              console.log("David barcode: ", barcode);
              this.registrationService.registerEmail(email, name, barcode).subscribe(
                () => {
                  this.isRegistered = true;
  
                  // Generate barcode to the email
                  this.sendBarcodeByEmail(email, name, barcode);
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
  


  extractName(email: string): string {
    let [firstName, lastName] = email.split('@')[0].split('.');
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return firstName + " " + lastName;
  }

  generateUniqueBarcode(email: string): string {
    // barcode generation?
    const barcodeString = this.barcodeGeneratorService.generateBarcodeValue(email);
  
    const barcodeValue = String(barcodeString);
  
  
    return barcodeValue;
  }
  

  async sendBarcodeByEmail(email: string, name: string, barcode: string) {
    // add barcode sending
    if (email) {
      try {
        await this.emailService.sendBarcode(email, name, barcode).toPromise();
        alert('Barcode sent successfully');
      } catch (error) {
        console.error('Error fetching borrower email or sending reminder:', error);
        alert('Error!');
        // Handle error fetching email or sending reminder
      }
    }
  }

  isValidEmailDomain(email: string): boolean {
    // check if email is from nhl
    return email.endsWith('@student.nhlstenden.com') || email.endsWith('@nhlstenden.com');
  }
}