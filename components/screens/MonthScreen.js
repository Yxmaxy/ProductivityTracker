import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { currentDate, currentDayInMonth, db } from '../common/globals';
import { colors } from '../common/styles';

const MonthScreen = () => {
    const [markedDates, setMarkedDates] = useState({});
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const setPercentageFromDate = (lookedAtDate) => {
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
                if (rows._array.length == 0)
                    percentage = 0;
                else
                    percentage /= rows._array.length;
                setMarkedDates(prevState => ({
                    ...prevState,
                    [lookedAtDate]: { color: `hsl(${parseInt(percentage * 100)}, 85%, 50%)`, textColor: "black" }
                }));
            }, (t, error) => {
                console.log(error);
            });
        });
    }

    useEffect(() => {
        // mark current date
        setMarkedDates({
            ...markedDates,
            [currentDate]: { color: colors.colorPopBlue, textColor: "white" },
        });        
        // mark last week of previous month
        let prevoiusYear = currentYear;
        let previousMonth = currentMonth;
        if (currentMonth === 0) {
            previousMonth = 12;
            prevoiusYear--;
        } else {
            previousMonth--;
        }
        const daysInPrevMonth = new Date(prevoiusYear, previousMonth, 0).getDate();
        for (let day = currentDayInMonth - 1; day >= 1; day--) {
            const lookedAtDate = new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + day).slice(-2);
            setPercentageFromDate(lookedAtDate);
        }
        for (let day = daysInPrevMonth; day >= daysInPrevMonth - 7; day--) {
            const lookedAtDate = prevoiusYear + "-" + ("0" + previousMonth).slice(-2) + "-" + ("0" + day).slice(-2);
            setPercentageFromDate(lookedAtDate);
        }
    }, []);

    useEffect(() => {
        if (currentYear < new Date().getFullYear() || (currentYear === new Date().getFullYear() && currentMonth < new Date().getMonth() + 1)) {
            const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
            for (let day = daysInPrevMonth; day >= 1; day--) {
                const lookedAtDate = currentYear + "-" + ("0" + currentMonth).slice(-2) + "-" + ("0" + day).slice(-2);
                setPercentageFromDate(lookedAtDate);
            }
        }
    }, [currentMonth]);

    return (
        <>
            <Calendar
                current={ currentDate }
                maxDate={ currentDate }
                onDayPress={(day) => {console.log('selected day', day)}}
                monthFormat={'MMM yyyy'}
                onMonthChange={month => {
                    const date = month.dateString.split("-");
                    setCurrentYear(parseInt(date[0]));
                    setCurrentMonth(parseInt(date[1]));
                }}
                firstDay={1}
                markingType={'period'}
                markedDates={ markedDates }
            />
        </>
    );
}

export default MonthScreen;