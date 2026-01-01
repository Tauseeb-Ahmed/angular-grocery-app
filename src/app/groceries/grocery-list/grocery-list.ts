import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { GroceryService } from '../../core/services/grocery.services';
import { Grocery } from '../../core/models/grocery.model';
import { GroceryCardComponent } from '../grocery-card/grocery-card';
import { uniqueGroceryNameValidator } from '../../core/validators/unique-grocery-name.validator';

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GroceryCardComponent,
  ],
  templateUrl: './grocery-list.html',
  styleUrl: './grocery-list.scss',
})
export class GroceryListComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly groceryService = inject(GroceryService);

  readonly addForm = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        uniqueGroceryNameValidator(this.groceryService),
      ],
    ],
    quantity: [1, [Validators.required, Validators.min(1)]],
    image: [''],
  });

  ngOnInit(): void {
    this.groceryService.load();
  }

  viewDetail(item: Grocery): void {
    this.router.navigate(['/grocery', item.id]);
  }

  addItem(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const { name, quantity, image } = this.addForm.getRawValue();

    this.groceryService.add({
      name: name.trim(),
      quantity,
      image: image?.trim() || undefined,
    });

    this.addForm.reset({ quantity: 1 });
  }

  deleteItem(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    this.groceryService.delete(id);
  }
}
