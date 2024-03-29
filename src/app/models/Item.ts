// models/Item.ts

export interface Item {
  CategoryName: string;
  Name: string;
  Status: string;
  Borrower?: string; // Make it optional
  DateReserved?: Date; // Make it optional
}
