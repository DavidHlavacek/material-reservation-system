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
import { MatSelectModule } from '@angular/material/select';
import { Item } from '../../models/Item';
import { MatSelectChange } from '@angular/material/select';

// Dummy data for testing purposes
const DATA: Item[] = [
  {
    itemID: 1,
    name: 'Portable Workhorse',
    category: 'Laptop',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 2,
    name: 'Data Traveler',
    category: 'USB',
    status: 'Rented Out',
    dateReserved: '25/12/2023',
    borrower: 'James Williams',
  },
  {
    itemID: 3,
    name: 'Tech Maverick',
    category: 'Laptop',
    status: 'Damaged',
    dateReserved: '25/11/2023',
    borrower: 'Robert Smith',
  },
  {
    itemID: 4,
    name: 'Sleek Companion',
    category: 'Laptop',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 5,
    name: 'Data Guardian',
    category: 'USB',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 6,
    name: 'Digital Nomad',
    category: 'Laptop',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 7,
    name: 'Presentation Maestro',
    category: 'Projector',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 8,
    name: 'Visual Innovator',
    category: 'Projector',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 9,
    name: 'Sound Pioneer',
    category: 'Speaker',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 10,
    name: 'Elite Companion',
    category: 'Laptop',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 11,
    name: 'Audio Maestro',
    category: 'Microphone',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
  {
    itemID: 12,
    name: 'Capture Pro',
    category: 'Camera',
    status: 'Available',
    dateReserved: 'N/A',
    borrower: 'N/A',
  },
];

//name of the filter, options for the filter, default value of the filter which is always "All"
export interface ItemsFilters {
  name: string;
  options: string[];
  defaultValue: string;
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
    AsyncPipe,
  ],
  templateUrl: './items-view.component.html',
  styleUrl: './items-view.component.css',
})
export class ItemsComponent implements AfterViewInit, OnInit {
  myControl = new FormControl('');
  searchOptions: string[] = DATA.map(item => item.name);
  searchFilteredOptions!: Observable<string[]>;

  //Set is used to remove duplicates
  //This is to populate the filter options that are displayed in the dropdown, gave example above in the interface
  categories: string[] = ['All', ...new Set(DATA.map(item => item.category))]; 
  statuses: string[] = ['All', ...new Set(DATA.map(item => item.status))];
  borrowers: string[] = ['All', ...new Set(DATA.map(item => item.borrower))];
  defaultValue: string = 'All';
  columnsFilters: ItemsFilters[] = [];

  filterDictionary = new Map<string, string>();

  columnsToDisplay: string[] = [
    'select',
    'itemID',
    'name',
    'category',
    'status',
    'dateReserved',
    'borrower',
  ];

  dataSource = new MatTableDataSource<Item>(DATA);

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Item>(
    this.allowMultiSelect,
    this.initialSelection
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() {
    //This is for the search bar
    this.searchFilteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    //This is for the filter dropdowns, define the filter options here
    this.columnsFilters.push({
      name: 'category',
      options: this.categories,
      defaultValue: this.defaultValue,
    });
    this.columnsFilters.push({
      name: 'status',
      options: this.statuses,
      defaultValue: this.defaultValue,
    });
    this.columnsFilters.push({
      name: 'borrower',
      options: this.borrowers,
      defaultValue: this.defaultValue,
    });
  }

  //This is for the pagination and sorting
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //this is for the search bar's autocomplete
  private _filter(value: string): string[] {
    if (value) {
      this.columnsFilters.forEach(filter => {
        filter.defaultValue = 'All';
      });
    }

    const filterValue = value.toLowerCase();

    return this.searchOptions.filter(searchOptions =>
      searchOptions.toLowerCase().includes(filterValue)
    );
  }

  //this is for the search bar immediate filtering when typing
  applySearchFilter(event: Event) {
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
  applyColumnsFilter(ob: MatSelectChange, columnsfilter: ItemsFilters) {
    //reset the data structure
    this.filterDictionary.clear();

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

    this.filterDictionary.set(columnsfilter.name, ob.value);
    var jsonString = JSON.stringify(
      Array.from(this.filterDictionary.entries())
    );
    this.dataSource.filter = jsonString;
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
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
