import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class I18nService {

  public messages = {};

  constructor(public http: HttpClient) {}

  // Update here to use the system locale
  // where is pt-BR should be a generic way to get the user OS Locale
  init(namespace: string): Promise<any> {
    return new Promise(resolve => {
      return resolve();
    });
  }

  private translate(namespace: string, code: string, defaultMessage: string): string {
    return defaultMessage;
  }

  doTranslate(namespace: string, message: any): Promise<string> {
    return new Promise(resolve => {
      this.init(namespace).then( res => {
        const messageCode = message.code;
        const defaultMessage = message.message;
        const msg = this.translate(namespace, messageCode, defaultMessage);
        resolve(msg);
      });
    });
  }

  doTranslateList(namespace: string, messages: any[]): Promise<string[]> {
    return new Promise(resolve => {
      const translatedMessages: string[] = [];
      this.init(namespace).then( res => {
        for (const m of messages) {
          const messageCode = m.code;
          const defaultMessage = m.message;
          const msg = this.translate(namespace, messageCode, defaultMessage);
          translatedMessages.push(msg);
        }

        resolve(translatedMessages);
      });
    });
  }

}
