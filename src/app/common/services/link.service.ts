import { Injectable } from '@angular/core';

@Injectable()
export class LinkService {

  constructor() {}

  public openLink(link: string) {
    if ((window as any).isElectron) {
      (window as any).chrome.ipcRenderer.send('open-link', link);
    } else {
      (window as any).open(link, '_blank');
    }
  }
}
