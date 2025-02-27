import { isTimeString } from 'ontime-utils';

const mts = 1000; // millis to seconds
const mtm = 1000 * 60; // millis to minutes
const mth = 1000 * 60 * 60; // millis to hours

export const timeFormat = 'HH:mm';
export const timeFormatSeconds = 'HH:mm:ss';
export const DAY_TO_MS = 86400000;

/**
 * @description Converts an excel date to milliseconds
 * @argument {string} date - excel string date
 * @returns {number} - time in milliseconds
 */

export const dateToMillis = (date: Date): number => {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return h * mth + m * mtm + s * mts;
};

/**
 * @description safe parse string to int, copied from client code
 * @param valueAsString
 * @return {number}
 */
const parse = (valueAsString: string): number => {
  const parsed = parseInt(valueAsString, 10);
  if (isNaN(parsed)) {
    return 0;
  }
  return Math.abs(parsed);
};

/**
 * @description Parses a time string to millis, copied from client code
 * @param {string} value - time string
 * @param {boolean} fillLeft - autofill left = hours / right = seconds
 * @returns {number} - time string in millis
 */
export const forgivingStringToMillis = (value: string, fillLeft = true): number => {
  let millis = 0;

  // split string at known separators    : , .
  const separatorRegex = /[\s,:.]+/;
  const [first, second, third] = value.split(separatorRegex);

  if (first != null && second != null && third != null) {
    // if string has three sections, treat as [hours] [minutes] [seconds]
    millis = parse(first) * mth;
    millis += parse(second) * mtm;
    millis += parse(third) * mts;
  } else if (first != null && second == null && third == null) {
    // if string has one section,
    // could be a complete string like 121010 - 12:10:10
    if (first.length === 6) {
      const hours = first.substring(0, 2);
      const minutes = first.substring(2, 4);
      const seconds = first.substring(4);
      millis = parse(hours) * mth;
      millis += parse(minutes) * mtm;
      millis += parse(seconds) * mts;
    } else {
      // otherwise lets treat as [minutes]
      millis = parse(first) * mtm;
    }
  }
  if (first != null && second != null && third == null) {
    // if string has two sections
    if (fillLeft) {
      // treat as [hours] [minutes]
      millis = parse(first) * mth;
      millis += parse(second) * mtm;
    } else {
      // treat as [minutes] [seconds]
      millis = parse(first) * mtm;
      millis += parse(second) * mts;
    }
  }
  return millis;
};

/**
 * @description Parses an excel date using the correct parser
 * @param {string} excelDate
 * @returns {number} - time in milliseconds

 */
export const parseExcelDate = (excelDate: string): number => {
  // attempt converting to date object
  const date = new Date(excelDate);
  if (date instanceof Date && !isNaN(date.getTime())) {
    return dateToMillis(date);
  } else if (isTimeString(excelDate)) {
    return forgivingStringToMillis(excelDate);
  }
  return 0;
};

/**
 * @description Converts milliseconds to seconds -- Copied from client code
 * @param {number | null} millis - time in seconds
 * @returns {number} Amount in seconds
 */
export const millisToSeconds = (millis: number | null): number => {
  if (millis === null) {
    return 0;
  }
  return millis < 0 ? Math.ceil(millis / mts) : Math.floor(millis / mts);
};
