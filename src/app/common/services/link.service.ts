import { Injectable } from '@angular/core';

@Injectable()
export class LinkService {

  constructor() {}

  public openLink(link: string) {
    if ((window as any).isElectron) {
      // window.chrome.ipcRendere;
    } else {
      window.open(link, '_blank');
    }
  }
}
