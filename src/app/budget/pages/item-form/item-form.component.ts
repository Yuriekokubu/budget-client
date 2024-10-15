import { Component, inject, OnInit } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, Location } from '@angular/common';
import { thMobile } from '../../../shared/validators/th-mobile.validator';
import { ItemService } from '../../item.service';
import { ItemStatus } from '../../models/item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  id: number | null = null;

  // Injecting services
  location = inject(Location);
  fb = inject(NonNullableFormBuilder);
  itemService = inject(ItemService);
  route = inject(ActivatedRoute);

  // Form controls for form fields
  titleControl = this.fb.control<string>('', { validators: Validators.required });
  contactMobileNo = this.fb.control<string>('', { validators: [Validators.required, thMobile] });
  amount = this.fb.control<number>(0, { validators: [Validators.required, Validators.min(1)] });
  price = this.fb.control<number>(0, { validators: [Validators.required, Validators.min(0.5)] });

  // Form group
  fg = this.fb.group({
    title: this.titleControl,
    contactMobileNo: this.contactMobileNo,
    amount: this.amount,
    price: this.price
  });


  // Property to hold the page title (Add/Edit)
  pageTitle: string = '';

  ngOnInit() {
    // Get the 'id' from the route if present and set up for editing
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id;  // Convert the string id to a number
        this.itemService.get(this.id).subscribe(v => this.fg.patchValue(v)); // Fetch the item details for editing
      }
    });

    // Get the title from the route's data and set the page title
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];  // Ensure this is being updated
      console.log('Page title from route:', this.pageTitle);  // Add this to verify the title is being fetched
    });
  }

  onBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    const item = { ...this.fg.getRawValue(), status: ItemStatus.PENDING };
    if (this.id) {
      // If editing, call the edit method
      this.itemService.edit(this.id, item).subscribe(() => this.onBack());
    } else {
      // If adding a new item, call the add method
      this.itemService.add(item).subscribe(() => this.onBack());
    }
  }
}
