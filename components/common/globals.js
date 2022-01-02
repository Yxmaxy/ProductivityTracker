import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("db.db");
export const currentDayInMonth = new Date().getDate();
export const currentDate = new Date().getFullYear() + "-" + ("0" + new Date().getMonth() + 1).slice(-2) + "-" + ("0" + currentDayInMonth).slice(-2);