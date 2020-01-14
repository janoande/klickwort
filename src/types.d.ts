// Workaround for including css files
declare module '*.css';

// Declare types for the langs npm package
declare module 'langs' {
    export type Language = {
        "name": string,
        "local": string,
        "1": string,
        "2": string,
        "2T": string,
        "2B": string,
        "3": string
    };
    export function all(): Language[];
    export function has(criteria: string, value: string): Boolean;
    export function codes(type: string): String[];
    export function names(local: string): String[];
    export function where(criteria: string, value: string): Language;
}
