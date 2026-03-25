import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
@Component({
  selector: 'app-contact-page',
  standalone: true,
  templateUrl: './contact.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
})
export class ContactPage {
  private readonly http = inject(HttpClient);
  users: WritableSignal<object[]> = signal([]);
  name = signal('');
  error: WritableSignal<object> = signal({});

  nameChanged(event: Event) {
    this.name.set((event.target as HTMLInputElement).value);
  }

  addUser() {
    const user = { name: this.name() };
    this.http.post('http://localhost:3000/users/add', user).subscribe({
      next: (response) => {
        this.users.update((users) => [...users, response]);
        this.name.set('');
        this.error.set({});
        console.log('User added successfully:', response);
      },
      error: (error) => {
        this.error.set(error);
        console.error('Error adding user:', error);
      },
    });
  }

  getUsers() {
    this.http.get('http://localhost:3000/users').subscribe({
      next: (res) => {
        this.error.set({});
        this.users.set(res as object[]);
      },
      error: (error) => {
        this.error.set(error);
        console.error('Error fetching users:', error);
      },
    });
  }
}
