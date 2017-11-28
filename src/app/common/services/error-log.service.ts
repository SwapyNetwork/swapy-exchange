import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class ErrorLogService {

  private errorObject: any;
  constructor(private electronService: ElectronService) {
    this.errorObject = {};
  }

  delete() {
    this.errorObject = {};
  }

  sendError() {
    console.error(this.errorObject);
    if (window.isElectron) {
      this.electronService.ipcRenderer.send('log-error', this.errorObject);
    }
    this.delete();
  }

  setClassName(className) {
    this.errorObject.className = className;
  }

  setFunctionName(functionName) {
    this.errorObject.functionName = functionName;
  }

  setBeforeETHbalance(beforeETHbalance) {
    this.errorObject.beforeETHbalance = beforeETHbalance;
  }

  setParamValues(paramValues) {
    this.errorObject.paramValues = paramValues;
  }

  setTXvalue(txValue) {
    this.errorObject.txValue = txValue;
  }

  setError(error) {
    this.errorObject.error = error;
    this.sendError();
  }

  setAfterETHbalance(afterETHbalance) {
    this.errorObject.afterETHbalance = afterETHbalance;
  }

}
