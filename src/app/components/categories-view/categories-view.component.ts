import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';

@Component({
  selector: 'app-categories-view',
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
    MatDialogModule,
  ],
  providers: [
    CategoryService,
  ],
  templateUrl: './categories-view.component.html',
  styleUrls: ['./categories-view.component.css'],
})
export class CategoriesViewComponent implements OnInit, AfterViewInit{
  selectControl = new FormControl('');
  searchControl = new FormControl('');
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Category>(this.allowMultiSelect, this.initialSelection);

  columnsToDisplay: string[] = [
    'select',
    'CategoryName',
    'Description',
    //'ToItems',
  ];

  dataSource = new MatTableDataSource<Category>();
  categories: Category[] = [];

  newCategory: Category = { CategoryName: '', Description: '' }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filteredCategories!: Observable<Category[]>;

  async ngOnInit() {
    await this.getCategoriesFromBackend();
    this.configureDataTable();
  }

  constructor(private categoryService: CategoryService, public categoryDialog: MatDialog,) {
    this.selectControl = new FormControl('');
    this.searchControl = new FormControl('');

  }

  ngAfterViewInit(): void {}

  createCategoryDialog(): void {
    const dialogRef = this.categoryDialog.open(CreateCategoryDialogComponent, {
      data: this.newCategory,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createCategory(result);
      }
    });
  }

  async createCategory(category: Category): Promise<void> {
    if(!category.CategoryName){return;}
    console.log('Submitting item onSubmit:', category); // Add this line
    try {
      const createdCategory: Category = await this.categoryService
        .createCategory(category)
        .toPromise();
      console.log('Item created successfully:', createdCategory);

      this.categories.unshift(category);

      // Optionally, you can navigate to another page or perform other actions after successful submission.
    } catch (error: any) {
      console.error('Error creating item:', error);
      // Handle the error, show a message, or perform other actions.
    }
  }

  /*
  createCategoryDialog(): void {
    const dialogRef = this.categoryDialog.open(CreateCategoryDialogComponent, {
      data: { CategoryName: '', Description: '' }, // Pass an empty object or default values
    });

    dialogRef.afterClosed().subscribe((result: Category | undefined) => {
      if (result) {
        this.createCategory(result);
      }
    });
  }

  async createCategory(category: Category): Promise<void> {
    if (!category.CategoryName) {
      return;
    }
    console.log('Submitting item onSubmit:', category);
  
    try {
      const createdCategory: Category = await this.categoryService.createCategory(category).toPromise();
      console.log('Item created successfully:', createdCategory);
  
      this.categories.unshift(createdCategory);
      // Optionally, you can navigate to another page or perform other actions after successful submission.
    } catch (error: any) {
      console.error('Error creating item:', error);
      // Handle the error, show a message, or perform other actions.
    }
  }
  */

  private configureDataTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getCategoriesFromBackend(): Promise<void> {
    try {
      const data: any = await this.categoryService.getCategories().toPromise();
      this.categories = data;
      this.dataSource = new MatTableDataSource<Category>(this.categories);
      console.log('Categories from backend:', this.categories);
    } catch (error: any) {
      console.error('Error fetching items from the backend:', error);
    }
  }

  resetFormControl(control: FormControl): void {
    control.setValue('');
  }
  
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  deleteSelectedCategories(): void {
    const selectedCategories = this.selection.selected;

    // Check if any categories are selected
    if (selectedCategories.length === 0) {
      return;
    }

    forkJoin(selectedCategories.map(category => this.categoryService.deleteCategory(category.CategoryName)))
    .subscribe(
      () => {
        this.getCategoriesFromBackend();
      },
      (error) => {
        console.error('Error deleting categories:', error);
      }
    );
  }

  isDeleteButtonEnabled(): boolean {
    console.log(this.selection.hasValue());
    return this.selection.hasValue();
  }
}