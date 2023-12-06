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

export interface ItemsFilters {
  name: string;
  options: string[];
  defaultValue: string;
}

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

  categories: string[] = ['All', ...new Set(DATA.map(item => item.category))];
  statuses: string[] = ['All', ...new Set(DATA.map(item => item.status))];
  borrowers: string[] = ['All', ...new Set(DATA.map(item => item.borrower))];
  defaultValue: string = 'All';
  itemsFilters: ItemsFilters[] = [];

  ngOnInit() {
    this.searchFilteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.itemsFilters.push({
      name: 'category',
      options: this.categories,
      defaultValue: this.defaultValue,
    });
    this.itemsFilters.push({
      name: 'status',
      options: this.statuses,
      defaultValue: this.defaultValue,
    });
    this.itemsFilters.push({
      name: 'borrower',
      options: this.borrowers,
      defaultValue: this.defaultValue,
    });
  }

  private _filter(value: string): string[] {
    if (value) {
      this.itemsFilters.forEach(filter => {
        filter.defaultValue = 'All';
      });
    }

    const filterValue = value.toLowerCase();

    return this.searchOptions.filter(searchOptions =>
      searchOptions.toLowerCase().includes(filterValue)
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    // Reset filterPredicate to default
    this.dataSource.filterPredicate = (data, filter) => {
      const dataStr = Object.keys(data)
        .reduce((currentTerm: string, key: string) => {
          return currentTerm + (data as { [key: string]: any })[key] + '◬';
        }, '')
        .toLowerCase();

      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.includes(transformedFilter);
    };

    // Apply the new filter to the data source
    this.dataSource.filter = filterValue;
  }

  filterDictionary = new Map<string, string>();

  applyItemsFilters(ob: MatSelectChange, itemsfilters: ItemsFilters) {
    this.myControl.setValue('');

    this.dataSource.filterPredicate = function (record, filter) {
      var map = new Map(JSON.parse(filter));
      let isMatch = false;

      for (let [key, value] of map) {
        isMatch = value === 'All' || record[key as keyof Item] == value;
        if (!isMatch) return false;
      }

      return isMatch;
    };

    this.filterDictionary.set(itemsfilters.name, ob.value);
    var jsonString = JSON.stringify(
      Array.from(this.filterDictionary.entries())
    );
    this.dataSource.filter = jsonString;
  }

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
