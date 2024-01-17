import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';

import { ItemService } from '../../services/item.service';
import { Item } from '../../models/Item';


@Component({
  selector: 'app-borrowers-view',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatCheckboxModule, 
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule],
  templateUrl: './borrowers-view.component.html',
  styleUrl: './borrowers-view.component.css'
})
export class BorrowersViewComponent {
//   columnsToDisplay: string[] = [
//     'select',
//     'UserID',
//     'Name',
//     'Email',
//     'NFCId'
//   ];

//   initialSelection = [];
//   allowMultiSelect = true;
//   selection = new SelectionModel<Item>(
//     this.allowMultiSelect,
//     this.initialSelection,
//   );

//   dataSource = new MatTableDataSource<Item>();

//   isAllSelected() {
//     const numSelected = this.selection.selected.length;
//     const numRows = this.dataSource.data.length;
//     return numSelected == numRows;
//   }

//   toggleAllRows() {
//     this.isAllSelected()
//       ? this.selection.clear()
//       : this.dataSource.data.forEach((row) => this.selection.select(row));
//   }
}
