// models/Item.ts

export interface Item {
  ItemID: number;
  CategoryName: string;
  BarcodeID: number;
  Name: string;
  Status: string;
  Borrower?: string; // Make it optional
  DateReserved?: Date; // Make it optional
}
