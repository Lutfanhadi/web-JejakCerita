import ENDPOINT from './api-endpoint';

class AuthApi {
  static async login(email, password) {
    const response = await fetch(ENDPOINT.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  static async register(name, email, password) {
    const response = await fetch(ENDPOINT.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  }
}

export default AuthApi;
