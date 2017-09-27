import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class I18nService {

  public messages = {};

  constructor(public http: HttpClient) {}

  // Update here to use the system locale
  // where is pt-BR should be a generic way to get the user OS Locale
  init(namespace: string):Promise<any> {
    return new Promise(resolve => {
      return resolve();
      // if all namespaces are loaded, resolve promise
      // if (this.messages[namespace] && this.messages["general"]) {
      //   return resolve();
      // }
      //
      // // load general messages
      // var general = "i18n/general/pt-BR.messages.json";
      // this.http.get(general)
      //   .subscribe(data => {
      //     // set general messages in list
      //     this.messages["general"] = data;
      //
      //     // load namespace messages
      //     var path = "i18n/"+namespace+"/pt-BR.messages.json";
      //     this.http.get(path)
      //       .subscribe(data_n => {
      //
      //         // set namespace messages in list
      //         this.messages[namespace] = data_n;
      //         return resolve();
      //       });
      //   });
    });
  }

  private translate(namespace:string, code:string, defaultMessage:string):string {
    return defaultMessage;
    // var msg = this.messages[namespace][code] ? this.messages[namespace][code] : this.messages["general"][code];
    // return msg ? msg : defaultMessage;
  }

  doTranslate(namespace:string, message:any):Promise<string> {
    return new Promise(resolve => {
      this.init(namespace).then( res => {
        let messageCode = message.code;
        let defaultMessage = message.message;
        let msg = this.translate(namespace, messageCode, defaultMessage);
        resolve(msg);
      });
    });
  }

  doTranslateList(namespace:string, messages:any[]):Promise<string[]> {
    return new Promise(resolve => {
      let translatedMessages:string[] = [];
      this.init(namespace).then( res => {
        for (var m of messages) {
          let messageCode = m.code;
          let defaultMessage = m.message;
          let msg = this.translate(namespace, messageCode, defaultMessage);
          translatedMessages.push(msg);
        }

        resolve(translatedMessages);
      });
    });
  }

}
