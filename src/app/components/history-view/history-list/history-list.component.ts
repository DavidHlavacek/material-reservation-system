import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Observable, map, startWith } from 'rxjs';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';


import { HistoryService } from '../../../services/history.service';
import { BorrowerService } from '../../../services/borrower.service';
import { EmailService } from '../../../services/email.service';
import { History } from '../../../models/History';

export interface ColumnsFilter {
  name: string;
  field: string;
  options: string[];
  defaultValue: string;
  selectedOptions: string[];
}

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule,
  ],
  providers: [
    HistoryService, EmailService, BorrowerService
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.css'
})

export class HistoryListComponent implements OnInit, AfterViewInit {

  private readonly DEFAULT_VALUE = 'All';
  selectControl = new FormControl('');
  searchControl = new FormControl('');
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<History>(this.allowMultiSelect, this.initialSelection);

  searchOptions!: string[];
  searchFilteredOptions!: Observable<string[]>;

  categories!: string[];
  hasReturned!: string[];
  borrowers!: string[];
  columnsFilter: ColumnsFilter[] = [];
  filterDictionary = new Map<string, string>();

  columnsToDisplay: string[] = [
    'select',
    'ItemID',
    'CategoryName',
    'Borrower',
    'DateReserved',
    'DateReturned',
  ];

  dataSource = new MatTableDataSource<History>();
  reservations: History[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit() {
    await this.getReservationsFromBackend();
    await this.initializeFilters();
    this.configureDataTable();
  }

  constructor(private historyService: HistoryService, private emailService: EmailService, private borrowersService: BorrowerService) {
    this.selectControl = new FormControl('');
    this.searchControl = new FormControl('');
    this.initializeOptions();
  }

  ngAfterViewInit(): void {}

  private configureDataTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getReservationsFromBackend(): Promise<void> {
    try {
      const data: any = await this.historyService.getEntries().toPromise();
      this.reservations = data;
      this.dataSource = new MatTableDataSource<History>(this.reservations);
      console.log('Reservations from backend:', this.reservations);
    } catch (error: any) {
      console.error('Error fetching items from the backend:', error);
    }
  }

  resetFormControl(control: FormControl): void {
    control.setValue('');
  }

  resetSelectSearch(columnsfilter: ColumnsFilter): void {
    this.resetFormControl(this.selectControl);
    columnsfilter.selectedOptions = columnsfilter.options;
  }
  
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  // the top select button should be able to select all if nothing is selected or unselect all if something is selected
  toggleAllRows(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  private initializeOptions(): void {
    this.searchOptions = [];
    this.categories = [];
    this.hasReturned = [];
    this.borrowers = [];

    this.searchFilteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    if (value) {
      this.resetColumnsFilterDefaults();
    }

    const filterValue = value.toLowerCase();

    return this.searchOptions.filter((searchOptions) =>
      searchOptions.toLowerCase().includes(filterValue),
    );
  }

  private resetColumnsFilterDefaults(): void {
    this.columnsFilter.forEach((filter) => {
      filter.defaultValue = this.DEFAULT_VALUE;
    });
  }

  selectSearch(value: string, columnsFilter: ColumnsFilter): string[] {
    const filter = value.toLowerCase();
    return columnsFilter.options.filter((option) =>
      option.toLowerCase().includes(filter),
    );
  }

  selectSearchOnKey(eventTarget: any, columnsFilter: ColumnsFilter): void {
    columnsFilter.selectedOptions = this.selectSearch(
      eventTarget.value,
      columnsFilter,
    );
  }

  applySearchFilter(event: Event): void {
    this.filterDictionary.clear();
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data, filter) => {
      const dataStr = Object.keys(data)
        .reduce((currentTerm: string, key: string) => {
          return currentTerm + (data as { [key: string]: any })[key] + '◬';
        }, '')
        .toLowerCase();

      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) !== -1;
    };

    this.dataSource.filter = filterValue;
  }

  applyColumnsFilter(ob: MatSelectChange, columnsfilter: ColumnsFilter): void {
    this.resetFormControl(this.searchControl);
    this.dataSource.filterPredicate = function (record: History, filter) {
      const map = new Map(JSON.parse(filter));
      let isMatch = false;

      for (const [key, value] of map) {
        if (key === 'hasReturned') {
          if (
            value === 'All' ||
            (value === 'Returned' && record.DateReturned) ||
            (value === 'Not Returned' && !record.DateReturned)
          ) {
            isMatch = true;
          } else {
            isMatch = false;
          }
        } else {
          isMatch = value === 'All' || record[key as keyof History] == value;
        }
        if (!isMatch) return false;
      }

      return isMatch;
    };

    this.filterDictionary.set(columnsfilter.field, ob.value);
    const jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  async initializeFilters(): Promise<void> {
    this.searchOptions = this.reservations.map((reservation: History) => String(reservation.ItemID));
    this.hasReturned = ['All', 'Returned', 'Not Returned']; 
    this.categories = ['All', ...new Set(this.reservations.map((reservation: History) => reservation.CategoryName))];
    this.borrowers = ['All', ...new Set(
      this.reservations
        .map((reservation: History) => reservation.Borrower)
        .filter(
          (borrower: string | undefined | null): borrower is string =>
            borrower !== undefined && borrower !== null && borrower !== '',
        ),
    )];
    console.log('Reservations:', this.reservations);
    console.log('Unique Categories:', this.categories);
    console.log('Unique Borrowers:', this.borrowers);

    this.columnsFilter = [
      this.createColumnsFilter('Category', 'CategoryName', this.categories),
      this.createColumnsFilter('Borrower', 'Borrower', this.borrowers),
      this.createColumnsFilter('Reservation Status', 'hasReturned', this.hasReturned),
    ];
  }

  resetFilters(): void {
    this.filterDictionary.clear();
    this.resetFormControl(this.searchControl);
    this.resetColumnsFilterDefaults();
    this.dataSource.filter = '';
  }

  private createColumnsFilter(name: string, field: string, options: string[]): ColumnsFilter {
    return {
      name,
      field,
      options,
      defaultValue: this.DEFAULT_VALUE,
      selectedOptions: options,
    };
  }
  // Send an angry email to all the borrowers we selected
  // This has a nice side effect of allowing you to literally spam anyone in school with 10000 emails
  // Our current security protocol is to hope no one tried to have unathorized access to this
  async sendReminder(): Promise<void> {
    const selectedItems = this.selection.selected;

    for (const item of selectedItems) {
      const borrower = item.Borrower;

      if (borrower) {
        try {
          const response = await this.borrowersService.getBorrowerEmail(borrower).toPromise();
          const borrowerEmail = response[0].Email;
          console.log(borrowerEmail);
          await this.emailService.sendReminder(borrower, borrowerEmail, String(item.ItemID));
        } catch (error) {
          console.error('Error fetching borrower email:', error);
        }
      }
    }
  }
  // The send reminder button should be disabled if the user has not selected anything
  isSendReminderButtonEnabled(): boolean {
    return this.selection.hasValue();
  }
}