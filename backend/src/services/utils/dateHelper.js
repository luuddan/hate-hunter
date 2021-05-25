export function addDays(date, days) {
    var dat = new Date(date)
    dat.setDate(dat.getDate() + days);
    return dat;
}


export function getDates(startDate, stopDate) {
    let dateArray = new Array();
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push({name: currentDate.toISOString().split('T')[0]})
      currentDate = addDays(currentDate, 1)
    }
    return dateArray;
  }
