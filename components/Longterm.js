import React, { useEffect } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

const Longterm = () => {
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Goals WHERE is_longterm;", [], (_, { rows }) => {
                console.log(rows._array);
            }, (t, error) => {
                console.log(error);
            })
        });
    }, []);

    return(<></>);
}

export default Longterm;