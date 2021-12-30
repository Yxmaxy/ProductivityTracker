import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { currentDate, currentDayInMonth, db } from '../common/globals';
import { colors } from '../common/styles';

const MonthScreen = () => {
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        setMarkedDates({
            ...markedDates,
            [currentDate]: { color: colors.colorPopBlue, textColor: "white" },
        });
        
        for (let day = 1; day < currentDayInMonth; day++) {
            const lookedAtDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + day;
            let percentage = 0;
            db.transaction(tx => {
                tx.executeSql(`
                    SELECT COUNT(*) AS finishedGoalsNum FROM (
                        SELECT id_goal
                        FROM GoalWeek JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                        WHERE strftime('%w', '${lookedAtDate}') = day
                        AND DATE('${lookedAtDate}') >= date_started
                        UNION
                        SELECT id_goal
                        FROM GoalMonth JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                        WHERE CAST(strftime('%d', '${currentDate}') AS Integer) BETWEEN day - num_available_before AND day
                        AND DATE('${currentDate}') >= date_started
                        UNION
                        SELECT id_goal
                        FROM GoalYear JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                        WHERE substr(DATE('${currentDate}'), 6) BETWEEN substr(DATE(date, '-' || num_available_before || ' days'), 6) AND substr(date, 6)
                        AND DATE('${currentDate}') >= date_started
                        UNION
                        SELECT id_goal
                        FROM GoalCustom JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                        WHERE ((round(julianday(strftime('%Y-%m-%d', '${currentDate}')) - julianday(first_date))) % num_days_between) = 0 OR ((round(julianday(strftime('%Y-%m-%d', '${currentDate}')) - julianday(first_date))) % num_days_between) >= num_days_between - num_available_before
                        AND DATE('${currentDate}') >= date_started
                    );
                `, [], (_, { rows }) => {
                    percentage = rows._array[0].finishedGoalsNum;
                }, (t, error) => {
                    console.log(error);
                });
                tx.executeSql(`
                    SELECT COUNT(*) AS allGoalsNum FROM (
                        SELECT id_goal
                        FROM GoalWeek JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                        WHERE strftime('%w', '${lookedAtDate}') = day
                        AND DATE('${lookedAtDate}') >= date_started
                        UNION
                        SELECT id_goal
                        FROM GoalMonth JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                        WHERE CAST(strftime('%d', '${currentDate}') AS Integer) BETWEEN day - num_available_before AND day
                        AND DATE('${currentDate}') >= date_started
                        UNION
                        SELECT id_goal
                        FROM GoalYear JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                        WHERE substr(DATE('${currentDate}'), 6) BETWEEN substr(DATE(date, '-' || num_available_before || ' days'), 6) AND substr(date, 6)
                        AND DATE('${currentDate}') >= date_started
                        UNION
                        SELECT id_goal
                        FROM GoalCustom JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                        WHERE ((round(julianday(strftime('%Y-%m-%d', '${currentDate}')) - julianday(first_date))) % num_days_between) = 0 OR ((round(julianday(strftime('%Y-%m-%d', '${currentDate}')) - julianday(first_date))) % num_days_between) >= num_days_between - num_available_before
                        AND DATE('${currentDate}') >= date_started
                    );
                `, [], (_, { rows }) => {
                    percentage /= rows._array[0].allGoalsNum;
                    setMarkedDates(prevState => ({
                        ...prevState,
                        [lookedAtDate]: { color: `hsl(${parseInt(percentage * 100)}, 85%, 50%)`, textColor: "black" }
                    }));
                }, (t, error) => {
                    console.log(error);
                });
            });   
        }
    }, []);

    return (
        <>
            <Calendar
                current={ currentDate }
                maxDate={ currentDate }
                onDayPress={(day) => {console.log('selected day', day)}}
                monthFormat={'MMM yyyy'}
                onMonthChange={(month) => {console.log('month changed', month)}}
                firstDay={1}
                markingType={'period'}
                markedDates={ markedDates }
            />
        </>
    );
}

export default MonthScreen;