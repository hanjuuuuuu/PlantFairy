import React, { useState, useEffect } from 'react';
import { Badge, Alert, Calendar } from 'antd';
//import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const Todo = () => {
    const [value, setValue] = useState(() => dayjs('2023-04-28'));
    const [selectedValue, setSelectedValue] = useState(() => dayjs('2023-04-28'));

    const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
    };

    const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
    };

    return (
        <>
            <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} />
            <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} />
        </>

    );


};

export default Todo;