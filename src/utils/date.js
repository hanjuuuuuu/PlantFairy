import {format, formatDistanceToNow, parseISO} from "date-fns";
import { ko } from "date-fns/locale";

/* 시간 */

export const getTimeAgo = (isoDate: string) => {
    let timeAgo = "";
    if (isoDate) {
        const date = parseISO(isoDate);
        const now = Date.now();
        const diffSeconds = (now - date.getTime()) / 1000;
        const oneDay = 60 * 60 * 24;

        if (diffSeconds < 60) {
        timeAgo = "방금 전";
    } else if (diffSeconds < oneDay) {
        const timePassed = formatDistanceToNow(date, {
            addSuffix: true,
            locale: ko
        });
        timeAgo = `${timePassed}`; 
    } else {
        timeAgo = `${format(date, "PPP EEE p", { locale: ko })}`;
    }
}

    return timeAgo;
};