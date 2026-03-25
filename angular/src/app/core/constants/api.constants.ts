import { environment } from '../../../environments/environment';

export const ApiRoutes = {
  Auth: {
    Login: `${environment.apiUrl}/auth/login`,
    Refresh: `${environment.apiUrl}/auth/refresh`,
    Logout: `${environment.apiUrl}/auth/logout`
  },
  Users: {
    Add: `${environment.apiUrl}/users/add`,
    GetAll: `${environment.apiUrl}/users`
  }
};
