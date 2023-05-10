export const trimContent = (content : string) => {
    const splitted = content.split("\n");
    /* 4줄 이상 ... 뜨도록 */
    if (splitted.length > 4) {
        const subSplitted = splitted.slice(0,4);

        return `${subSplitted.join("\n")}...`;
    }

    /* 200자 이상 ... 뜨도록 */
    if (content.length > 200) {
        return `${content.substring(0, 199)}...`;
    }

    return content;
};