import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import emailjs from '@emailjs/browser';
// @ts-ignore
import Email from "../../assets/smtp.js";


@Injectable({
  providedIn: "root",
})
export class EmailService {
  private readonly apiUrlSendReminder = 'http://localhost:3000/api/send-reminder'; // Adjust the URL accordingly
  private readonly apiUrlSendBarcode = 'http://localhost:3000/api/send-barcode'; // Adjust the URL accordingly

  constructor(private http: HttpClient) { }

  sendReminder(borrower: string, borrowerEmail: string, itemName: string) {
    const emailData = {
      to: borrowerEmail,
      subject: 'Reminder',
      body: `Dear ${borrower},\n\nIt's time to return ${itemName}.`,
    };

    return this.http.post(this.apiUrlSendReminder, emailData);
  }

  sendBarcode(borrowerEmail: string, name:string, barcode: string) {
    const emailData = {
      to: borrowerEmail,
      subject: 'Barcode',
      body: `Dear ${name},\n\nYour barcode is: ${barcode}.`,
    };

    return this.http.post(this.apiUrlSendBarcode, emailData);
  }
}

//OLDER VERSION

// export class EmailService {
//   constructor(private http: HttpClient) { }


//   sendReminder(borrower: string, borrowerEmail: string, itemName: string) {
//     const templateParams = {
//       borrower: borrower,
//       itemName: itemName,
//     };
//     emailjs.send('service_piov62j', 'template_si5a2m6', templateParams, 'IxOVAVtHAUyCGnet7')
//       .then((response) => {
//         alert('Sent!');
//       }, (err) => {
//         alert('FAILED...');
//       });
//   }
// }

// //   sendReminder(borrower: string, borrowerEmail: string, itemName: string) {
// //     console.log("sendReminder");
// //     Email.send({
// //       Host: "smtp.elasticemail.com",
// //       Username: "davehlave@gmail.com",
// //       Password: "33E4E086AE0CF81F2D670441A1A1E3C99A01",
// //       To: "davehlave@gmail.com",
// //       From: `davehlave@gmail.com`,
// //       Subject: "Reminder",
// //       Body: ` `

// //     }).then((message: any) => {
// //       alert(message)
// //     })
// //   }
// // }
// // sendReminder(borrower: string, itemName: string) {
// //   const emailData = {
// //     to: borrower,
// //     subject: 'Reminder: Return Item',
// //     body: `Dear ${borrower},\n\nIt's time to return ${itemName}.`,
// //   };

// //   return this.http.post(this.apiUrl, emailData);

// // }
