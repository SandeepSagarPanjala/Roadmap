import {
  ChangeDetectionStrategy,
  Component,
  linkedSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';

interface LoginModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  templateUrl: './contact.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
})
export class ContactPage {
  loginModel: WritableSignal<LoginModel> = signal({
    username: '',
    password: '',
  });

  isSubmitted = signal(false);

  isValidEmail = linkedSignal(() => {
    const emailValue = this.loginModel().username;
    const value = String(emailValue ?? '').trim();
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  });

  loginForm = form(this.loginModel, (s) => {
    required(s.username, { message: 'Username is required' });
    email(s.username, { message: 'Value is not a valid email' });
    required(s.password, { message: 'Password is required' });
  });

  submit($event: Event) {
    $event.preventDefault();
    this.isSubmitted.set(true);
    const { username, password } = this.loginModel();
    if (this.loginForm().invalid()) {
      console.log('Form is invalid. Please fill in all required fields.');
      return;
    }
    console.log('Login submitted with:', { username, password });
  }
}
