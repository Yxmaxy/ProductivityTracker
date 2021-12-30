import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("db.db");
export const currentDayInMonth = new Date().getDate();
export const currentDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + currentDayInMonth;