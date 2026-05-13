import { VerifyCallback } from 'passport-google-oauth20';
declare const GoogleStrategy_base: any;
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
