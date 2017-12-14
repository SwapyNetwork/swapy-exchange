import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class LinkService {

  constructor(private electronService: ElectronService) {}

  public openLink(link: string) {
    if ((window as any).isElectron) {
      this.electronService.shell.openExternal(link);
    } else {
      window.open(link, '_blank');
    }
  }
}
