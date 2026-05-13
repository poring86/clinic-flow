import { Strategy, VerifyCallback } from 'passport-google-oauth20';
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor();
    validate(accessToken: string, _refreshToken: string, profile: {
        name: {
            givenName: string;
            familyName: string;
        };
        emails: {
            value: string;
        }[];
        photos: {
            value: string;
        }[];
    }, done: VerifyCallback): Promise<void>;
}
export {};
