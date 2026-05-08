import { Component, signal, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface FormData {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('technical-assessment-internship-frontend');
  contactForm: FormGroup;
  formSubmitted = signal(false);
  submitError = signal('');
  submitSuccess = signal('');
  isLoading = signal(false);
  submittedData = signal<FormData | null>(null);
  modalInstance: any = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngAfterViewInit() {
    // Get modal instance after view init
    if (typeof window !== 'undefined' && (window as any).bootstrap) {
      const modalElement = document.getElementById('resultModal');
      if (modalElement) {
        this.modalInstance = new (window as any).bootstrap.Modal(modalElement);
      }
    }
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }

  onSubmit() {
    this.formSubmitted.set(true);
    this.submitError.set('');
    this.submitSuccess.set('');

    if (this.contactForm.invalid) {
      this.submitError.set('Please fix the form errors');
      return;
    }

    const formData = this.contactForm.value;
    this.isLoading.set(true);

    // Simulate HTTP call to a backend service
    // Using JSONPlaceholder as a mock API
    this.http.post('https://jsonplaceholder.typicode.com/posts', {
      title: formData.name,
      body: `Email: ${formData.email}\nMessage: ${formData.message}`,
      userId: 1
    }).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.submittedData.set(formData);
        this.submitSuccess.set('Form submitted successfully!');
        
        // Show modal
        if (this.modalInstance) {
          this.modalInstance.show();
        }
        
        // Reset form after a delay
        setTimeout(() => {
          this.contactForm.reset();
          this.formSubmitted.set(false);
        }, 2000);
        
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error:', error);
        this.submitError.set('Failed to submit form. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  resetForm() {
    this.contactForm.reset();
    this.formSubmitted.set(false);
    this.submittedData.set(null);
    this.submitError.set('');
    this.submitSuccess.set('');
  }
}
