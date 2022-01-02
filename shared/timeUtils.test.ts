import { TMonth, TWeek, getMonthAndWeeks } from "./timeUtils";

test("same month", () => {
  expect(
    getMonthAndWeeks(new Date("2014-05-01"), new Date("2014-05-02"))
  ).toEqual([
    [{ monthIdx: 4, numDays: 2 }],
    [{ fromStr: "05/01", toStr: "05/02", numDays: 2 }],
  ]);
  expect(
    getMonthAndWeeks(new Date("2014-05-03"), new Date("2014-05-04"))
  ).toEqual([
    [{ monthIdx: 4, numDays: 2 }],
    [
      { fromStr: "05/03", toStr: "05/03", numDays: 1 },
      { fromStr: "05/04", toStr: "05/04", numDays: 1 },
    ],
  ]);
  expect(
    getMonthAndWeeks(new Date("2014-05-03"), new Date("2014-05-10"))
  ).toEqual([
    [{ monthIdx: 4, numDays: 8 }],
    [
      { fromStr: "05/03", toStr: "05/03", numDays: 1 },
      { fromStr: "05/04", toStr: "05/10", numDays: 7 },
    ],
  ]);
  expect(
    getMonthAndWeeks(new Date("2014-05-03"), new Date("2014-05-21"))
  ).toEqual([
    [{ monthIdx: 4, numDays: 19 }],
    [
      { fromStr: "05/03", toStr: "05/03", numDays: 1 },
      { fromStr: "05/04", toStr: "05/10", numDays: 7 },
      { fromStr: "05/11", toStr: "05/17", numDays: 7 },
      { fromStr: "05/18", toStr: "05/21", numDays: 4 },
    ],
  ]);
  expect(
    getMonthAndWeeks(new Date("2014-05-01"), new Date("2014-05-29"))
  ).toEqual([
    [{ monthIdx: 4, numDays: 29 }],
    [
      { fromStr: "05/01", toStr: "05/03", numDays: 3 },
      { fromStr: "05/04", toStr: "05/10", numDays: 7 },
      { fromStr: "05/11", toStr: "05/17", numDays: 7 },
      { fromStr: "05/18", toStr: "05/24", numDays: 7 },
      { fromStr: "05/25", toStr: "05/29", numDays: 5 },
    ],
  ]);
});

test("multi-month", () => {
  expect(
    getMonthAndWeeks(new Date("2021-05-29"), new Date("2021-06-02"))
  ).toEqual([
    [
      { monthIdx: 4, numDays: 3 },
      { monthIdx: 5, numDays: 2 },
    ],
    [
      { fromStr: "05/29", toStr: "05/29", numDays: 1 },
      { fromStr: "05/30", toStr: "06/02", numDays: 4 },
    ],
  ]);
});
