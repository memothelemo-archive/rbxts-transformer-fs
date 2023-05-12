import {} from "@rbxts/types";

export function $readFileOpt(path: string): string | undefined;
export function $readFile(path: string): string;

/** Probably copied from `rbxts-transform-debug` */
export const $CURRENT_FILE_NAME: string;

export function $expectFile(path: string, message?: string): void;
export function $expectDir(path: string, message?: string): void;
export function $expectPath(path: string, message?: string): void;

export function $dirExists(path: string): boolean;
export function $fileExists(path: string): boolean;
export function $pathExists(path: string): boolean;

export function $instance<T extends Instance = Instance>(path: string, exact?: boolean): T;
export function $instanceAny<T extends Instance = Instance>(path: string, exact?: boolean): T;

export function $waitForInstance<T extends Instance = Instance>(path: string, timeout?: number, exact?: boolean): T;
export function $waitForInstanceAny<T extends Instance = Instance>(path: string, timeout?: number, exact?: boolean): T;

export function $hashFile(path: string, alg: "sha1" | "sha128" | "sha256" | "sha512" | "md5"): string;

// Deprecated stuff
/**
 * @deprecated Use `$read(path)` instead.
 */
export function $fileContents(path: string): string;
/**
 * @deprecated Use `$expectFile(path)` instead.
 */
export function $requireFile(path: string): void;
/**
 * @deprecated Use `$CURRENT_FILE_NAME` instead.
 */
export function $fileName(): void;
