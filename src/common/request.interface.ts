export enum RequestSource {
    API = 'api',
    JOB = 'job',
}

export interface IRequestInfo {
    source: RequestSource;
    ip?: string;
    ua?: string;
    job?: string;
    country?: string;
}

export interface IBussinessRequest {
    req_info: IRequestInfo;
}
