export declare type Configuration = {
    allowHttp: boolean;
    timeout: number;
};
declare class Config {
    static setAllowHttp(value: boolean): void;
    static setTimeout(value: number): void;
    static isAllowHttp(): boolean;
    static getTimeout(): number;
    static setDefault(): void;
}
export { Config };
