  import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
  import { MatTableDataSource, MatTableModule } from '@angular/material/table';
  import { MatSort, MatSortModule } from '@angular/material/sort';
  import { MatCheckboxModule } from '@angular/material/checkbox';
  import { SelectionModel } from '@angular/cdk/collections';
  import { MatAutocompleteModule } from '@angular/material/autocomplete';
  import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { Observable } from 'rxjs';
  import { map, startWith } from 'rxjs/operators';
  import { AsyncPipe } from '@angular/common';
  import { MatInputModule } from '@angular/material/input';
  import {MatDividerModule} from '@angular/material/divider';
  import { MatSelectModule } from '@angular/material/select';
  import { MatSelectChange } from '@angular/material/select';
  import {MatButtonModule} from '@angular/material/button';
  import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
  import { ItemService } from '../../services/item.service';
  import { Item } from '../../models/Item';
  // Dummy data for testing purposes

  //name of the filter, options for the filter, default value of the filter which is always "All"
  export interface ColumnsFilter {
    name: string;
    field: string;
    options: string[];
    defaultValue: string;
    selectedOptions: string[];
  }
  //Example: name - Status
  //         options - Available, Damaged, Rented Out
  //         defaultValue - All

  @Component({
    selector: 'app-items-view',
    standalone: true,
    imports: [
      CommonModule,
      MatFormFieldModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatCheckboxModule,
      MatAutocompleteModule,
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatDividerModule,
      NgxMatSelectSearchModule,
      AsyncPipe,
    ],
    providers: [ItemService],
    templateUrl: './items-view.component.html',
    styleUrl: './items-view.component.css',
  })
  export class ItemsComponent implements AfterViewInit, OnInit {
    myControl = new FormControl('');
    selectControl = new FormControl('');

    searchOptions: string[];
    searchFilteredOptions!: Observable<string[]>;

    categories: string[];
    statuses: string[];
    borrowers: string[];
    defaultValue: string = 'All';
    columnsFilter: ColumnsFilter[] = [];

    filterDictionary = new Map<string, string>();

    columnsToDisplay: string[] = [
      'select',
      'ItemID',
      'Name',
      'CategoryName',
      'Status',
      'DateReserved',
      'Borrower',
    ];

    initialSelection = [];
    allowMultiSelect = true;
    selection = new SelectionModel<Item>(
      this.allowMultiSelect,
      this.initialSelection,
    );

    dataSource = new MatTableDataSource<Item>();
    items: Item[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private itemService: ItemService) {
      this.searchOptions = [];
      this.categories = [];
      this.statuses = [];
      this.borrowers = [];

      this.searchFilteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filter(value || '')),
      );
    }

    //await fetch otherwise filter options won't be populated
    //and other bugs
    async ngOnInit() {
      await this.getItemsFromBackend();
      await this.initializeFilters();

      //This is for the pagination and sorting
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      //This is for the search bar
      this.searchFilteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filter(value || '')),
      );

      //This is for the filter dropdowns, define the filter options here
    }

    ngAfterViewInit(): void {}

    async getItemsFromBackend(): Promise<void> {
      try {
        const data: any = await this.itemService.getItems().toPromise();
        this.items = data;
        this.dataSource = new MatTableDataSource<Item>(this.items);
        console.log('Items from the backend:', this.items);
      } catch (error: any) {
        console.error('Error fetching items from the backend:', error);
      }
    }

    async initializeFilters(): Promise<void> {
      // Populate filter options after fetching data

      //Set is used to remove duplicates
      //This is to populate the filter options that are displayed
      //in the dropdown, gave example above in the interface
      this.searchOptions = this.items.map((item: Item) => item.Name);
      this.categories = [
        'All',
        ...new Set(this.items.map((item: Item) => item.CategoryName)),
      ];
      this.statuses = [
        'All',
        ...new Set(this.items.map((item: Item) => item.Status)),
      ];
      this.borrowers = [
        'All',
        ...new Set(
          this.items
            .map((item: Item) => item.Borrower) // Extract Borrower values
            .filter(
              (borrower: string | undefined | null): borrower is string =>
                borrower !== undefined && borrower !== null && borrower !== '',
            ), // Filter out undefined, null, and empty string values
        ),
      ];

      this.columnsFilter = [
        {
          name: 'Category',
          field: 'CategoryName',
          options: this.categories,
          defaultValue: this.defaultValue,
          selectedOptions: this.categories
        },
        {
          name: 'Status',
          field: 'Status',
          options: this.statuses,
          defaultValue: this.defaultValue,
          selectedOptions: this.statuses
        },
        {
          name: 'Borrower',
          field: 'Borrower',
          options: this.borrowers,
          defaultValue: this.defaultValue,
          selectedOptions: this.borrowers
        },
      ];
    }

    //this is for the search bar's autocomplete
    private _filter(value: string): string[] {
      if (value) {
        this.columnsFilter.forEach((filter) => {
          filter.defaultValue = 'All';
        });
      }

      const filterValue = value.toLowerCase();

      return this.searchOptions.filter((searchOptions) =>
        searchOptions.toLowerCase().includes(filterValue),
      );
    }

    selectSearch(value: string, columnsFilter: ColumnsFilter) {
      const filter = value.toLowerCase();
      return columnsFilter.options.filter((option) =>
        option.toLowerCase().includes(filter)
      );
    }
    

    selectSearchOnKey(eventTarget: any, columnsFilter: ColumnsFilter) {
      columnsFilter.selectedOptions = this.selectSearch(eventTarget.value, columnsFilter);
    }

    //this is for the search bar immediate filtering when typing
    applySearchFilter(event: Event) {
      //reset the data structure of the other filter here
      //so that when you go back to column filtering
      //there isn't one already preset
      //(broke my brain for a couple hours)
      this.filterDictionary.clear();

      const filterValue = (event.target as HTMLInputElement).value
        .trim()
        .toLowerCase();

      // Reset filterPredicate to default
      // filterPredicate is a function that defines how to filter,
      // it is different for the search bar, and different for the columns filter,
      // so I have to reset it and redefine it
      // depending on what the user chooses to filter with
      // SO, if the user starts typing in the search bar,
      // the filterPredicate will be set to this,
      // and the columnns filters all reset to "All"
      // and vice versa, if the user chooses a column filter,
      // the filterPredicate will be set to the second implementation
      // and the search bar will be reset to empty

      //THIS IS THE DEFAULT IMPLEMENTATION OF THE FILTER PREDICATE
      //I DEFINE IT IN BOTH applySearchFilter() AND applyColumnsFilter()
      //SO THAT BOTH CAN BE USED (INDEPENDENTLY)!!
      //P.S.: Yes, I am a genius (((; - David
      this.dataSource.filterPredicate = (data, filter) => {
        // Transform the data into a lowercase string of all property values.
        const dataStr = Object.keys(data)
          .reduce((currentTerm: string, key: string) => {
            // VVV This is from the documentation VVV

            // Use an obscure Unicode character to delimit the words in the concatenated string.
            // This avoids matches where the values of two columns combined will match the user's query
            // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
            // that has a very low chance of being typed in by somebody in a text field. This one in
            // particular is "White up-pointing triangle with dot" from
            // https://en.wikipedia.org/wiki/List_of_Unicode_characters
            return currentTerm + (data as { [key: string]: any })[key] + '◬';
          }, '')
          .toLowerCase();

        // Transform the filter by converting it to lowercase and removing whitespace.
        const transformedFilter = filter.trim().toLowerCase();

        return dataStr.indexOf(transformedFilter) != -1;
      };

      // Apply the new filter to the data source
      this.dataSource.filter = filterValue;
    }

    

    //this is for the columns filters
    applyColumnsFilter(ob: MatSelectChange, columnsfilter: ColumnsFilter) {
      this.myControl.setValue('');

      //THIS IS THE SECOND CUSTOM IMPLEMENTATION OF THE FILTER PREDICATE
      //TO MAKE THE COLUMNS FILTERS WORK!!!!
      this.dataSource.filterPredicate = function (record, filter) {
        var map = new Map(JSON.parse(filter));
        let isMatch = false;

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
      this.dataSource.filter = jsonString;
    }

    resetFilters() {
      this.filterDictionary.clear();
      this.myControl.setValue('');
      this.dataSource.filterPredicate = (data, filter) => {
        const dataStr = Object.keys(data)
          .reduce((currentTerm: string, key: string) => {
            return currentTerm + (data as { [key: string]: any })[key] + '◬';
          }, '')
          .toLowerCase();
    
        const transformedFilter = filter.trim().toLowerCase();
    
        return dataStr.indexOf(transformedFilter) !== -1;
      };
      this.columnsFilter.forEach((filter) => {
        filter.defaultValue = 'All';
      });
      this.dataSource.filter = '';
      console.log("RESET THAT SHIT");
    }

    resetSelectSearch(columnsfilter: ColumnsFilter) {
      this.selectControl.setValue('');
      columnsfilter.selectedOptions = columnsfilter.options;
    }

    // This is for the checkboxes
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected == numRows;
    }

    // Selects all rows if they are not all selected; otherwise clear selection
    toggleAllRows() {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }
