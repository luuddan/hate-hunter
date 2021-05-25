export const getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt.toISOString().slice(0, 10) <= end.toISOString().slice(0, 10); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt).toISOString().slice(0, 10));
    }
    return arr;
};