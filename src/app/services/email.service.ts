import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// @ts-ignore
import Email from "../../assets/smtp.js";


@Injectable({
  providedIn: "root",
})
export class EmailService {
  constructor(private http: HttpClient) { }

  sendReminder(borrower: string, itemName: string) {
    console.log("sendReminder");
    Email.send({
      Host: "smtp.elasticemail.com",
      Username: "davehlave@gmail.com",
      Password: "33E4E086AE0CF81F2D670441A1A1E3C99A01",
      To: "davehlave@gmail.com",
      From: `davehlave@gmail.com`,
      Subject: "Reminder",
      Body: `Dear ${borrower},\n\nIt's time to return ${itemName}.`

    }).then((message: any) => {
      alert(message)
    })
  }
}
// sendReminder(borrower: string, itemName: string) {
//   const emailData = {
//     to: borrower,
//     subject: 'Reminder: Return Item',
//     body: `Dear ${borrower},\n\nIt's time to return ${itemName}.`,
//   };

//   return this.http.post(this.apiUrl, emailData);

// }
