import React, { useEffect } from 'react';
import { Calendar } from 'react-native-calendars';

const MonthScreen = () => {
    useEffect(() => {
        // get previous results
    }, [])
    
    const currentDate = new Date().toISOString().split('T')[0];

    const markedDates = {};
    markedDates[currentDate] = { color: "dodgerblue", textColor: "white" }

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