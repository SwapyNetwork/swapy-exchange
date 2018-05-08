import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() {}

  public setItem(name, data) {
    if (data !== null && typeof data === 'object') {
      return localStorage.setItem(name, JSON.stringify(data))
    } else {
      return localStorage.setItem(name, data)
    }
  }

  public getItem(name) {
    const data = {};
    data[name] = localStorage.getItem(name);
    try {
      return JSON.parse(data[name]);
    } catch (e) {
      return data[name];
    }
  }

  public remove(name) {
    return localStorage.removeItem(name);
  }

  public clear() {
    return localStorage.clear();
  }

}
