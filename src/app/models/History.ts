// models/History.ts

export interface History {
    ItemID: number;
    UserID: number;
    CategoryName: string;
    Borrower: string; 
    DateReserved: Date; 
    DateReturned?: Date;
  }
  