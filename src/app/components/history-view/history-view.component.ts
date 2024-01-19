import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';


import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { HttpClient } from '@angular/common/http';

import { HistoryService } from '../../services/history.service';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/Item';
import { History } from '../../models/History';
import { ColumnsFilter } from '../items-view/items-view.component';

@Component({
  selector: 'app-history-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    MatDividerModule,
    RouterModule,
    AsyncPipe,
  ],
  providers: [HistoryService, ItemService],
  templateUrl: './history-view.component.html',
  styleUrl: './history-view.component.css'
})

export class HistoryViewComponent {
  columnsToDisplay: string[] = [
    "select",
    "ItemID",
    "ItemCategory",
    "Borrower",
    "BorrowDate",
    "ReturnDate",
  ]
  dataSourceHistory = new MatTableDataSource<History>();
  dataSourceItem = new MatTableDataSource<Item>();
  combinedDataSource: any[] = [];

  item_list: Item[] = [];
  history_list: History[] = []

  constructor(private itemService: ItemService, private historyService: HistoryService) {
    //this.initializeFormControls();
    //this.initializeOptions();
  }

  async ngOnInit() {
    /*
    combine data from history list and items and make that the MatTableDataSource
    create a new table using
    */

    //await this.getItemsFromBackend();
    //await this.getHistoriesFromBackend();
    //await this.initializeFilters();
    //this.configureDataTable();
  }

  ngAfterViewInit(): void {
  }

  private getItem(target_id: number): Item | null {
    for (var item of this.item_list) {
      if (target_id == item.ItemID) {
        return item;
      }
    }
    return null;
  }
}
  /*
  async getItemsFromBackend(): Promise<void> {
    try {
      const data: any = await this.itemService.getItems().toPromise();
      this.item_list = data;
      this.dataSourceItem = new MatTableDataSource<Item>(this.item_list);
      console.log('Items from backend:', this.item_list);
    } catch (error: any) {
      console.error('Error fetching items from the backend:', error);
    }
  }

  async getHistoriesFromBackend(): Promise<void> {
    try {
      const data: any = await this.historyService.getEntries().toPromise();
      this.history_list = data;
      this.dataSourceHistory = new MatTableDataSource<History>(this.history_list);
      console.log('Histories from backend:', this.history_list);
    } catch (error: any) {
      console.error('Error fetching items from the backend:', error);
    }
  }
*/

  /*
  searchControl = new FormControl('');
  selectControl = new FormControl('');

  searchOptions!: string[];
  searchFilteredOptions!: Observable<string[]>;

  categories!: string[];
  returned!: string[];
  borrowers!: string[];
  defaultValue: string = 'All';
  columnsFilter: ColumnsFilter[] = [];

  filterDictionary = new Map<string, string>();

  columnsToDisplay: string[] = [
    'select',
    'ItemID',
    'Name',
    'CatName',
    'DateReserved',
    'DateReturned'
  ];

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Item>(
    this.allowMultiSelect,
    this.initialSelection,
  );

  dataSourceItems = new MatTableDataSource<Item>();
  dataSourceHistories = new MatTableDataSource<History>();
  items: Item[] = [];
  history: History[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private itemService: ItemService, private historyService: HistoryService) {
    this.initializeFormControls();
    this.initializeOptions();
  }

  async ngOnInit() {
    await this.getItemsFromBackend();
    await this.getHistoriesFromBackend();
    await this.initializeFilters();
    this.configureDataTable();
  }

  ngAfterViewInit(): void {}

  private initializeFormControls(): void {
    this.searchControl = new FormControl('');
    this.selectControl = new FormControl('');
  }

  private initializeOptions(): void {
    this.searchOptions = [];
    this.categories = [];
    this.returned = [];
    this.borrowers = [];

    this.searchFilteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    );
  }

  private configureDataTable(): void {
    this.dataSourceHistories.paginator = this.paginator;
    this.dataSourceHistories.sort = this.sort;
    this.searchFilteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    );
  }

  async getItemsFromBackend(): Promise<void> {
    try {
      const data: any = await this.itemService.getItems().toPromise();
      this.items = data;
      this.dataSourceItems = new MatTableDataSource<Item>(this.items);
      console.log('Items from backend:', this.items);
    } catch (error: any) {
      console.error('Error fetching items from the backend:', error);
    }
  }

  async getHistoriesFromBackend(): Promise<void> {
    try {
      const data: any = await this.historyService.getEntries().toPromise();
      this.history = data;
      this.dataSourceHistories = new MatTableDataSource<History>(this.history);
      console.log('Histories from backend:', this.history);
    } catch (error: any) {
      console.error('Error fetching items from the backend:', error);
    }
  }

  async initializeFilters(): Promise<void> {
    this.searchOptions = this.history.map((history: History) => history.Borrower);
    this.categories = [
      'All',
      ...new Set(this.histories.map((history: History) => history.CategoryName)),
    ];
    this.returned = [
      'All',
      'Returned',
      'Not Returned',
    ];
    this.borrowers = [
      'All',
      ...new Set(
        this.items
          .map((item: Item) => this.history.Name)
          .filter(
            (borrower: string | undefined | null): borrower is string =>
              borrower !== undefined && borrower !== null && borrower !== '',
          ),
      ),
    ];

    this.columnsFilter = [
      this.createColumnsFilter('Category', 'CategoryName', this.categories),
      this.createColumnsFilter('Status', 'Status', this.returned),
      this.createColumnsFilter('Borrower', 'Borrower', this.borrowers),
    ];
  }

  private createColumnsFilter(
    name: string,
    field: string,
    options: string[],
  ): ColumnsFilter {
    return {
      name,
      field,
      options,
      defaultValue: this.defaultValue,
      selectedOptions: options,
    };
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
      filter.defaultValue = 'All';
    });
  }

  // This function handles filtering for the select search.
  selectSearch(value: string, columnsFilter: ColumnsFilter) {
    const filter = value.toLowerCase();
    return columnsFilter.options.filter((option) =>
      option.toLowerCase().includes(filter),
    );
  }

  // This function is called on key events for the select search.
  selectSearchOnKey(eventTarget: any, columnsFilter: ColumnsFilter) {
    columnsFilter.selectedOptions = this.selectSearch(
      eventTarget.value,
      columnsFilter,
    );
  }

  // This function applies the search filter when typing in the main search bar.
  applySearchFilter(event: Event) {
    //reset the data structure of the other filter here
    //so that when you go back to column filtering
    //there isn't one already preset
    //(broke my brain for a couple hours)
    this.filterDictionary.clear();

    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    // Reset fP to default
    // fP is a function that defines how to filter,
    // it is different for the search bar, and different for the columns filter,
    // so I have to reset it and redefine it
    // depending on what the user chooses to filter with
    // SO, if the user starts typing in the search bar,
    // the fP will be set to this,
    // and the columnns filters all reset to "All"
    // and vice versa, if the user chooses a column filter,
    // the fP will be set to the second implementation
    // and the search bar will be reset to empty

    //THIS IS THE DEFAULT IMPLEMENTATION OF THE FILTER PREDICATE
    //I DEFINE IT IN BOTH applySearchFilter() AND applyColumnsFilter()
    //SO THAT BOTH CAN BE USED (INDEPENDENTLY)!!
    //P.S.: Yes, I am a genius (((; - David
    this.dataSourceHistories.filterPredicate = (data, filter) => {
      const dataStr = Object.keys(data)
        .reduce((currentTerm: string, key: string) => {
          return currentTerm + (data as { [key: string]: any })[key] + '◬';
        }, '')
        .toLowerCase();

      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) != -1;
    };

    this.dataSourceHistories.filter = filterValue;
  }
  
  // This function applies the filter for column dropdowns.
  applyColumnsFilter(ob: MatSelectChange, columnsfilter: ColumnsFilter) {
    this.resetFormControl(this.searchControl);
    //THIS IS THE SECOND CUSTOM IMPLEMENTATION OF THE FILTER PREDICATE
    //TO MAKE THE COLUMNS FILTERS WORK!!!!
    this.dataSourceHistories.filterPredicate = function (record, filter) {
      var map = new Map(JSON.parse(filter));
      let isMatch = false;

      // TODO IMPLEMENT IS_RETURNED FILTER

      for (let [key, value] of map) {
        isMatch = value === 'All' || record[key as keyof Item] == value;
        if (!isMatch) return false;
      }

      return isMatch;
    };

    this.filterDictionary.set(columnsfilter.field, ob.value);
    var jsonString = JSON.stringify(
      Array.from(this.filterDictionary.entries()),
    );
    this.dataSourceHistories.filter = jsonString;
  }
  
  resetFormControl(control: FormControl): void {
    control.setValue('');
  }

  // This function resets all filters.
  resetFilters() {
    this.filterDictionary.clear();
    this.resetFormControl(this.searchControl);
    this.resetColumnsFilterDefaults();
    this.dataSourceHistories.filter = '';
  }

  resetSelectSearch(columnsfilter: ColumnsFilter) {
    this.resetFormControl(this.selectControl);
    columnsfilter.selectedOptions = columnsfilter.options;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceHistories.data.length;
    return numSelected == numRows;
  }

  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSourceHistories.data.forEach((row) => this.selection.select(row));
  }
}
  */
