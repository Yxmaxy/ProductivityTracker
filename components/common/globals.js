import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("db.db");
export const currentDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();