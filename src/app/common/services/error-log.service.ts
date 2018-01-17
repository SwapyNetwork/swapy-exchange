import { Injectable } from '@angular/core';
@Injectable()
export class ErrorLogService {

  private errorObject: any;
  constructor() {
    this.errorObject = {};
  }

  delete() {
    this.errorObject = {};
  }

  sendError() {
    // @TODO Implement third party error log service
    if ((window as any).isElectron) {
      console.log('log-error', this.errorObject);
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
