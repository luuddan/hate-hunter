export function getDate(monthsAgo){
    let d = new Date()
    d.setMonth(d.getMonth()-monthsAgo);
    return d;
}

export function getDateDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }
