export type TMonth = {
  monthIdx: number;
  numDays: number;
};

export type TWeek = {
  fromStr: string;
  toStr: string;
  numDays: number;
};

function addDays(date: Date, days: number): Date {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(start: Date, end: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const diffDays = Math.round(Math.abs((+end - +start) / oneDay));
  return diffDays;
}

function getDateStr(date: Date) {
  const month = (1 + date.getUTCMonth()).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return month + "/" + day;
}

export function getMonthAndWeeks(from: Date, to: Date): [TMonth[], TWeek[]] {
  const retMonths = [];
  const retWeeks = [];

  const toTime = to.getTime();
  let currMonth: TMonth = { monthIdx: from.getUTCMonth(), numDays: 0 };
  
  while (from.getTime() <= toTime) {
    if (currMonth.monthIdx !== from.getUTCMonth()) {
      retMonths.push(currMonth);
      currMonth = { monthIdx: from.getUTCMonth(), numDays: 0 };
    }

    let skipDays = 7 - from.getUTCDay();
    const start = from;
    let end = addDays(start, skipDays - 1);
    if (end.getTime() > toTime) {
      end = to;
      skipDays = daysBetween(start, end) + 1;
    }
    if (start.getUTCMonth() !== end.getUTCMonth()) {
      currMonth.numDays += skipDays - end.getUTCDate();
      retMonths.push(currMonth);
      currMonth = {
        monthIdx: end.getUTCMonth(),
        numDays: end.getUTCDate(),
      };
    } else {
      currMonth.numDays += skipDays;
    }

    retWeeks.push({
      fromStr: getDateStr(from),
      toStr: getDateStr(end),
      numDays: skipDays,
    });

    from = addDays(from, skipDays);
  }

  if (currMonth.numDays !== 0) {
    retMonths.push(currMonth);
  }

  return [retMonths, retWeeks];
}
