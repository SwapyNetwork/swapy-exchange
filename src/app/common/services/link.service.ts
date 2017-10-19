import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class LinkService {

  constructor(private electronService: ElectronService) {}

  public openLink(link: string) {
    this.electronService.shell.openExternal(link);
  }
}
