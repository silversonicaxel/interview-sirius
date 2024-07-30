import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  async post(formData: FormData) {
    return new Promise((resolve, reject) => {
      fetch('https://httpbingo.org/post', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            reject(new Error('Error in response'));
          }
        })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    })
  }
}
