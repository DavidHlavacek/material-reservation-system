import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Router } from '@angular/router';
import {
  Form,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Item } from '../../models/Item';
import { CategoryService } from '../../services/category.service';
import { ItemService } from '../../services/item.service';
import { Category } from '../../models/Category';
import { MatDialog } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';

@Component({
  selector: 'app-create-item-view',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  providers: [CategoryService, ItemService],
  templateUrl: './create-item-view.component.html',
  styleUrl: './create-item-view.component.css',
})
export class CreateItemViewComponent {
  item: Item = {
    ItemID: 1,
    CategoryName: '',
    BarcodeID: 1,
    Name: '',
    Status: 'Issued',
  };
  categories: Category[] = [];
  selectedOptions: Category[] = [];
  selectControl = new FormControl('');
  newCategory: Category = { CategoryName: '', Description: '' };

  constructor(
    private categoryService: CategoryService,
    private itemService: ItemService,
    public categoryDialog: MatDialog,
    private router: Router // Add this line
  ) {}

  async ngOnInit() {
    await this.getCategoriesFromBackend();
    await this.initialize();
  }

  async initialize(): Promise<void> {
    this.selectedOptions = this.categories;
  }

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

  async onSubmit(item: Item): Promise<void> {
    console.log('Submitting item onSubmit:', item); // Add this line
    try {
      const createdItem: Item = await this.itemService
        .createItem(item)
        .toPromise();
      console.log('Item created successfully:', createdItem);
      this.item = {
        ItemID: 1,
        CategoryName: '',
        BarcodeID: 1,
        Name: '',
        Status: 'Issued',
      };

      // Optionally, you can navigate to another page or perform other actions after successful submission.
    } catch (error: any) {
      console.error('Error creating item:', error);
      // Handle the error, show a message, or perform other actions.
    }
  }

  resetFormControl(formControl: FormControl) {
    formControl.setValue('');
  }

  resetSelectSearch() {
    this.resetFormControl(this.selectControl);
    this.selectedOptions = this.categories;
  }

  selectSearch(value: string) {
    const filter = value.toLowerCase();
    return this.categories.filter((option) =>
      option.CategoryName.toLowerCase().includes(filter),
    );
  }

  // This function is called on key events for the select search.
  selectSearchOnKey(eventTarget: any) {
    this.selectedOptions = this.selectSearch(eventTarget.value);
  }

  async getCategoriesFromBackend(): Promise<void> {
    try {
      const data: any = await this.categoryService.getCategories().toPromise();
      this.categories = data;
      console.log('Items from the backend:', this.categories);
    } catch (error: any) {
      console.error('Error fetching items from the backend:', error);
    }
  }
}
