import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formGroup!: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();

  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'firstName': [null, Validators.required],
      'lastName': [null, Validators.required],
      'npiNumber': [null, Validators.required],
      'businessAddress': [null, [Validators.required]],
      'phoneNumber': [null, [Validators.required, Validators.maxLength(11), this.checkPhoneNumber]],
      'email': [null, [Validators.required, Validators.email], this.checkInUseEmail],
    });
  }



  get firstName() {
    return this.formGroup.get('firstName') as FormControl
  }

  get lastName() {
    return this.formGroup.get('lastName') as FormControl
  }

  get npiNumber() {
    return this.formGroup.get('npiNumber') as FormControl
  }

  checkPhoneNumber(control: any) {
    let phoneNumberValue = control.value
    let phoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return (!phoneNumber.test(phoneNumberValue) && phoneNumberValue) ? { 'requirements': true } : null;
  }

  checkInUseEmail(control: any) {
    // mimic http database access
    let db = ['jack@torchwood.com'];
    return new Observable(observer => {
      setTimeout(() => {
        let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
        observer.next(result);
        observer.complete();
      }, 4000)
    })
  }

  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Field is required' :
      this.formGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.formGroup.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPhoneNumber() {
    return this.formGroup.get('phoneNumber').hasError('required') ? 'Fiel is required' :
      this.formGroup.get('phoneNumber').hasError('requirements') ? 'Telephone Number must be number only  and should have max 11 digit' : '';
  }

  onSubmit(post: any) {
    this.post = post;
  }

}
