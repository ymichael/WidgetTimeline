export type TDateFormat = "DD/MM" | "MM/DD";

export type TWeekFormat = "MON_TO_SUN" | "SUN_TO_MON" | "MON_TO_FRI";

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

function getDateStr(date: Date, dateFormat: TDateFormat) {
  const month = (1 + date.getUTCMonth()).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  if (dateFormat === "DD/MM") {
    return day + "/" + month;
  } else {
    return month + "/" + day;
  }
}

function getSkipDays(day: number, weekFormat: TWeekFormat): number {
  switch (weekFormat) {
    case "SUN_TO_MON":
      return 7 - day;
    case "MON_TO_FRI":
    case "MON_TO_SUN":
      return day === 0 ? 1 : 8 - day;
  }
}

export function getMonthAndWeeks(
  from: Date,
  to: Date,
  dateFormat: TDateFormat = "MM/DD",
  weekFormat: TWeekFormat = "SUN_TO_MON"
): [TMonth[], TWeek[]] {
  const retMonths = [];
  const retWeeks = [];

  const toTime = to.getTime();
  let currMonth: TMonth = { monthIdx: from.getUTCMonth(), numDays: 0 };

  while (from.getTime() <= toTime) {
    let skipDays = getSkipDays(from.getUTCDay(), weekFormat);
    if (
      weekFormat === "MON_TO_FRI" &&
      skipDays < 3 &&
      (from.getUTCDay() === 0 || from.getUTCDay() === 6)
    ) {
      from = addDays(from, skipDays);
      continue;
    }

    if (currMonth.monthIdx !== from.getUTCMonth()) {
      if (currMonth.numDays > 0) {
        retMonths.push(currMonth);
      }
      currMonth = { monthIdx: from.getUTCMonth(), numDays: 0 };
    }

    const start = from;
    let end =
      weekFormat === "MON_TO_FRI"
        ? addDays(start, skipDays - 3)
        : addDays(start, skipDays - 1);

    if (end.getTime() > toTime) {
      end = to;
      while (
        weekFormat === "MON_TO_FRI" &&
        (end.getUTCDay() === 6 || end.getUTCDay() === 0)
      ) {
        end = addDays(end, -1);
      }
    }

    const skipTo = addDays(from, skipDays);
    skipDays = daysBetween(start, end) + 1;

    if (start.getUTCMonth() !== end.getUTCMonth()) {
      currMonth.numDays += skipDays - end.getUTCDate();
      if (currMonth.numDays > 0) {
        retMonths.push(currMonth);
      }
      currMonth = {
        monthIdx: end.getUTCMonth(),
        numDays: end.getUTCDate(),
      };
    } else {
      currMonth.numDays += skipDays;
    }

    retWeeks.push({
      fromStr: getDateStr(from, dateFormat),
      toStr: getDateStr(end, dateFormat),
      numDays: skipDays,
    });

    from = skipTo;
  }

  if (currMonth.numDays !== 0) {
    retMonths.push(currMonth);
  }

  return [retMonths, retWeeks];
}
