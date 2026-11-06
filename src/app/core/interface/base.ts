export interface BaseModel {
  Id: number;
  CreatedBy?: string;
  CreatedOn?: Date | any;
  LastUpdatedBy?: string;
  LastUpdatedOn?: Date | any;
}

export interface ApiResult {
  Result: any;
  Status: boolean;
  Message: string;
}

export interface VerificatinLogs {
  LogKey: string;
  TenantId: string;
  VisitorRandId: number;
  Xos: string;
  Uid: string;
  Zck: string;
  AuthCode: string;
  channel: string;
  EventCode: string;
  Format: string;
  Token: string;
  Session: string;
  MfiLog: string;
}