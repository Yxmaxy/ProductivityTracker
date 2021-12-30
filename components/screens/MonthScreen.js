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
                    SELECT id_goal
                    FROM GoalWeek JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                    WHERE date_finished = '${lookedAtDate}'
                    AND strftime('%w', '${lookedAtDate}') = day
                    AND DATE('${lookedAtDate}') >= date_started;
                    UNION
                    SELECT id_goal
                    FROM GoalMonth JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                    WHERE date_finished = (strftime('%Y-%m-','${lookedAtDate}') || day)
                    AND CAST(strftime('%d', '${lookedAtDate}') AS Integer) BETWEEN day - num_available_before AND day
                    AND DATE('${lookedAtDate}') >= date_started
                    UNION
                    SELECT id_goal
                    FROM GoalYear JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                    WHERE date_finished = (strftime('%Y-','${lookedAtDate}') || strftime('%m-%d', date))
                    AND substr(DATE('${lookedAtDate}'), 6) BETWEEN substr(DATE(date, '-' || num_available_before || ' days'), 6) AND substr(date, 6)
                    AND DATE('${lookedAtDate}') >= date_started;
                    UNION
                    SELECT id_goal
                    FROM GoalCustom JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                    WHERE date_finished = strftime("%Y-%m-%d", julianday('${currentDate}', '+' || num_days_between || ' days', '-' || ((round(julianday('${currentDate}') - julianday(first_date))) % num_days_between) || ' days'))
                    AND ((round(julianday(strftime('%Y-%m-%d', '${lookedAtDate}')) - julianday(first_date))) % num_days_between) = 0 OR ((round(julianday(strftime('%Y-%m-%d', '${currentDate}')) - julianday(first_date))) % num_days_between) >= num_days_between - num_available_before
                    AND DATE('${lookedAtDate}') >= date_started;
                `, [], (_, { rows }) => {
                    console.log(rows._array.length);
                    percentage = rows._array.length;
                }, (t, error) => {
                    console.log(error);
                });
                tx.executeSql(`
                    SELECT id_goal
                    FROM GoalWeek JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                    WHERE strftime('%w', '${lookedAtDate}') = day
                    AND DATE('${lookedAtDate}') >= date_started;
                    UNION
                    SELECT id_goal
                    FROM GoalMonth JOIN Goals AS g USING(id_goal) JOIN GoalFinished USING(id_goal)
                    WHERE CAST(strftime('%d', '${lookedAtDate}') AS Integer) BETWEEN day - num_available_before AND day
                    AND DATE('${lookedAtDate}') >= date_started
                    UNION
                    SELECT id_goal
                    FROM GoalYear JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                    WHERE substr(DATE('${lookedAtDate}'), 6) BETWEEN substr(DATE(date, '-' || num_available_before || ' days'), 6) AND substr(date, 6)
                    AND DATE('${lookedAtDate}') >= date_started
                    UNION
                    SELECT id_goal
                    FROM GoalCustom JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                    WHERE ((round(julianday(strftime('%Y-%m-%d', '${lookedAtDate}')) - julianday(first_date))) % num_days_between) = 0 OR ((round(julianday(strftime('%Y-%m-%d', '${currentDate}')) - julianday(first_date))) % num_days_between) >= num_days_between - num_available_before
                    AND DATE('${lookedAtDate}') >= date_started;
                `, [], (_, { rows }) => {
                    //console.log(rows._array);
                    if (rows._array.length == 0)
                        percentage = 0;
                    else
                        percentage /= rows._array.length;
                    console.log(percentage + "\n" + rows._array.length +"\n");
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