/* eslint-disable no-prototype-builtins */
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';

const splitRE = /\r?\n/;

/* eslint-disable @typescript-eslint/no-use-before-define */
export function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isEmptyObject<T extends object>(obj: T): boolean {
  if (!obj) return true;
  return Reflect.ownKeys(obj).length === 0;
}

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined';
export const isString = (val: any): val is string => typeof val === 'string';
export const isNumber = (val: any): val is number => typeof val === 'number';
export const isEmpty = (array: any): boolean => !(array && array.length > 0);
export const isSymbol = (val: any): val is symbol => typeof val === 'symbol';

export const isWindows = os.platform() === 'win32';

export function pad(source: string, n = 2): string {
  const lines = source.split(splitRE);
  return lines.map((l) => ` `.repeat(n) + l).join(`\n`);
}

export function clearScreen() {
  try {
    if (isWindows) {
      process.stdout.write('\x1B[2J\x1B[0f');
    } else {
      process.stdout.write('\x1Bc');
    }
  } catch (error) {
    console.error('Failed to clear screen:', error);
  }
}

export function normalizePath(id: string): string {
  return path.posix.normalize(id);
}

export function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target];
}

export function getFileSystemStats(file: string): fs.Stats | undefined {
  try {
    return fs.statSync(file, { throwIfNoEntry: false });
  } catch (error) {
    console.error(`Error accessing file ${file}:`, error);
    return undefined;
  }
}

/**
 * Null or whatever
 */
export type Nullable<T> = T | null | undefined;

/**
 * Array, or not yet
 */
export type ArrayAble<T> = T | Array<T>;

export function toArray<T>(array?: Nullable<ArrayAble<T>>): Array<T> {
  return array ? (Array.isArray(array) ? array : [array]) : [];
}


export function mergeObjects<T extends Record<string, any>, U extends Record<string, any>>(obj1: T, obj2: U): T & U {
  const merged: Record<string, any> = { ...obj1 };

  Object.keys(obj2).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (merged.hasOwnProperty(key) && typeof obj2[key] === 'object' && !Array.isArray(obj2[key])) {
        merged[key] = mergeObjects(merged[key], obj2[key]);
      } else {
        merged[key] = obj2[key];
      }
    }
  });

  return merged as T & U;
}


export async function asyncFlatten<T>(arr: T[]): Promise<T[]> {
  do {
    arr = (await Promise.all(arr)).flat(Infinity) as any;
  } while (arr.some((v: any) => v?.then));
  return arr;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
