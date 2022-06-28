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
  expect(
    getMonthAndWeeks(new Date("2021-01-02"), new Date("2021-02-02"))
  ).toEqual([
    [
      { monthIdx: 0, numDays: 30 },
      { monthIdx: 1, numDays: 2 },
    ],
    [
      { fromStr: "01/02", toStr: "01/02", numDays: 1 },
      { fromStr: "01/03", toStr: "01/09", numDays: 7 },
      { fromStr: "01/10", toStr: "01/16", numDays: 7 },
      { fromStr: "01/17", toStr: "01/23", numDays: 7 },
      { fromStr: "01/24", toStr: "01/30", numDays: 7 },
      { fromStr: "01/31", toStr: "02/02", numDays: 3 },
    ],
  ]);
});

test("multi-month (dd/mm)", () => {
  expect(
    getMonthAndWeeks(new Date("2021-05-29"), new Date("2021-06-02"), "DD/MM")
  ).toEqual([
    [
      { monthIdx: 4, numDays: 3 },
      { monthIdx: 5, numDays: 2 },
    ],
    [
      { fromStr: "29/05", toStr: "29/05", numDays: 1 },
      { fromStr: "30/05", toStr: "02/06", numDays: 4 },
    ],
  ]);
});

test("multi-month (SUN_TO_MON)", () => {
  expect(
    getMonthAndWeeks(
      new Date("2022-05-01"),
      new Date("2022-06-30"),
      "DD/MM",
      "SUN_TO_MON"
    )
  ).toEqual([
    [
      { monthIdx: 4, numDays: 31 },
      { monthIdx: 5, numDays: 30 },
    ],
    [
      { fromStr: "01/05", toStr: "07/05", numDays: 7 },
      { fromStr: "08/05", toStr: "14/05", numDays: 7 },
      { fromStr: "15/05", toStr: "21/05", numDays: 7 },
      { fromStr: "22/05", toStr: "28/05", numDays: 7 },
      { fromStr: "29/05", toStr: "04/06", numDays: 7 },
      { fromStr: "05/06", toStr: "11/06", numDays: 7 },
      { fromStr: "12/06", toStr: "18/06", numDays: 7 },
      { fromStr: "19/06", toStr: "25/06", numDays: 7 },
      { fromStr: "26/06", toStr: "30/06", numDays: 5 },
    ],
  ]);
});

test("multi-month (MON_TO_SUN)", () => {
  expect(
    getMonthAndWeeks(
      new Date("2022-05-01"),
      new Date("2022-06-30"),
      "DD/MM",
      "MON_TO_SUN"
    )
  ).toEqual([
    [
      { monthIdx: 4, numDays: 31 },
      { monthIdx: 5, numDays: 30 },
    ],
    [
      { fromStr: "01/05", toStr: "01/05", numDays: 1 },
      { fromStr: "02/05", toStr: "08/05", numDays: 7 },
      { fromStr: "09/05", toStr: "15/05", numDays: 7 },
      { fromStr: "16/05", toStr: "22/05", numDays: 7 },
      { fromStr: "23/05", toStr: "29/05", numDays: 7 },
      { fromStr: "30/05", toStr: "05/06", numDays: 7 },
      { fromStr: "06/06", toStr: "12/06", numDays: 7 },
      { fromStr: "13/06", toStr: "19/06", numDays: 7 },
      { fromStr: "20/06", toStr: "26/06", numDays: 7 },
      { fromStr: "27/06", toStr: "30/06", numDays: 4 },
    ],
  ]);
});

test("multi-month (MON_TO_FRI)", () => {
  expect(
    getMonthAndWeeks(
      new Date("2022-05-01"),
      new Date("2022-06-30"),
      "DD/MM",
      "MON_TO_FRI"
    )
  ).toEqual([
    [
      { monthIdx: 4, numDays: 22 },
      { monthIdx: 5, numDays: 22 },
    ],
    [
      { fromStr: "02/05", toStr: "06/05", numDays: 5 },
      { fromStr: "09/05", toStr: "13/05", numDays: 5 },
      { fromStr: "16/05", toStr: "20/05", numDays: 5 },
      { fromStr: "23/05", toStr: "27/05", numDays: 5 },
      { fromStr: "30/05", toStr: "03/06", numDays: 5 },
      { fromStr: "06/06", toStr: "10/06", numDays: 5 },
      { fromStr: "13/06", toStr: "17/06", numDays: 5 },
      { fromStr: "20/06", toStr: "24/06", numDays: 5 },
      { fromStr: "27/06", toStr: "30/06", numDays: 4 },
    ],
  ]);

  expect(
    getMonthAndWeeks(
      new Date("2022-04-30"),
      new Date("2022-05-15"),
      "DD/MM",
      "MON_TO_FRI"
    )
  ).toEqual([
    [{ monthIdx: 4, numDays: 10 }],
    [
      { fromStr: "02/05", toStr: "06/05", numDays: 5 },
      { fromStr: "09/05", toStr: "13/05", numDays: 5 },
    ],
  ]);
  expect(
    getMonthAndWeeks(
      new Date("2022-04-28"),
      new Date("2022-05-15"),
      "DD/MM",
      "MON_TO_FRI"
    )
  ).toEqual([
    [
      { monthIdx: 3, numDays: 2 },
      { monthIdx: 4, numDays: 10 },
    ],
    [
      { fromStr: "28/04", toStr: "29/04", numDays: 2 },
      { fromStr: "02/05", toStr: "06/05", numDays: 5 },
      { fromStr: "09/05", toStr: "13/05", numDays: 5 },
    ],
  ]);
});
