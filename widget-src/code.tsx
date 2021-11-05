const { widget } = figma;
const {
  AutoLayout,
  Text,
  Frame,
  Ellipse,
  Image,
  useEffect,
  useSyncedState,
  usePropertyMenu,
} = widget;

const DAY_WIDTH = 40;
const WEEK_WIDTH = DAY_WIDTH * 7;
const MONTH_FILL = "#9747ff";
const WEEK_FILL = "#eadaff";

const MONTH_IDX_TO_NAME = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Month({ month, children }: { month: TMonth; children?: any }) {
  let label = MONTH_IDX_TO_NAME[month.monthIdx]
  if (month.numDays <= 7) {
    label = label.slice(0, 3)
  }
  return (
    <AutoLayout
      width={DAY_WIDTH * month.numDays}
      direction="vertical"
      padding={{ horizontal: 10 }}
    >
      <AutoLayout
        width="fill-parent"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        padding={12}
        cornerRadius={10}
        fill={MONTH_FILL}
      >
        <Text fill="#FFF" fontFamily="Inter" fontSize={42} fontWeight={500}>
          {label}
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

function Week({ week }) {
  return (
    <AutoLayout
      width={DAY_WIDTH * week.numDays}
      padding={{ horizontal: 10 }}
      direction="vertical"
    >
      <AutoLayout
        width="fill-parent"
        fill={WEEK_FILL}
        cornerRadius={10}
        padding={15}
        verticalAlignItems="center"
        horizontalAlignItems="center"
      >
        <Text fontFamily="Inter" fontSize={32}>
          {week.fromStr} - {week.toStr}
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

type TMonth = {
  monthIdx: number;
  numDays: number;
};

type TWeek = {
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
  return end.getDate() - start.getDate() + 1;
}

function getDateStr(date: Date) {
  const month = (1 + date.getMonth()).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return month + "/" + day;
}

function getMonthAndWeeks(from: Date, to: Date): [TMonth[], TWeek[]] {
  const retMonths = [];
  const retWeeks = [];

  const toTime = to.getTime();
  let currMonth: TMonth = { monthIdx: from.getMonth(), numDays: 0 };
  while (from.getTime() < toTime) {
    if (currMonth.monthIdx !== from.getMonth()) {
      retMonths.push(currMonth);
      currMonth = { monthIdx: from.getMonth(), numDays: 0 };
    }

    let skipDays = 7 - from.getDay();
    const start = from;
    let end = addDays(from, skipDays - 1);
    if (end.getTime() > toTime) {
      end = new Date(toTime);
      skipDays = daysBetween(start, end);
    }
    if (start.getMonth() !== end.getMonth()) {
      currMonth.numDays += skipDays - end.getDate();
      retMonths.push(currMonth);
      currMonth = {
        monthIdx: end.getMonth(),
        numDays: end.getDate(),
      };
    } else {
      currMonth.numDays += skipDays;
    }

    retWeeks.push({
      fromStr: getDateStr(from),
      toStr: getDateStr(end),
      numDays: end.getDay() - from.getDay() + 1,
    });

    from = addDays(from, skipDays);
  }

  if (currMonth.numDays !== 0) {
    retMonths.push(currMonth);
  }

  return [retMonths, retWeeks];
}

const today = new Date();
const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);

const dateTrunc = (x) => x.split(" ").slice(1, 4).join(" ")

function Timeline() {
  const [from, setFrom] = useSyncedState("from", today.toString());
  const [to, setTo] = useSyncedState("to", nextMonth.toString());

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const showDatePicker = () => {
    
    return new Promise(
      () => {
        figma.showUI(`
          <script>
            window.defaultDateFrom = ${JSON.stringify(from)}
            window.defaultDateTo = ${JSON.stringify(to)}
          </script>
          ${__html__}
        `);
      },
      {
        width: 516,
        height: 300,
      }
    );
  }

  usePropertyMenu(
    [
      {
        itemType: "action",
        tooltip: `${dateTrunc(from)} - ${dateTrunc(to)}`,
        propertyName: "setRange",
      },
    ],
    ({ propertyName }) => {
      return showDatePicker()
    }
  );
  useEffect(() => {
    figma.ui.onmessage = (msg) => {
      switch (msg.type) {
        case "resize":
          figma.ui.resize(msg.width, msg.height);
          break;
        case "from":
          setFrom(msg.dateStr);
          break;
        case "to":
          if (fromDate.getTime() > new Date(msg.dateStr).getTime()) {
            figma.notify("Please choose an end date after the start date.", {
              error: true,
            });
          } else {
            setTo(msg.dateStr);
          }
          break;
      }
    };
  });

  const [months, weeks] = getMonthAndWeeks(fromDate, toDate);
  return (
    <AutoLayout direction="vertical" spacing={10}>
      <AutoLayout direction="horizontal" padding={0} spacing={0}>
        {months.map((month) => {
          return <Month key={month.monthIdx} month={month} />;
        })}
      </AutoLayout>
      <AutoLayout direction="horizontal" padding={0} spacing={0}>
        {weeks.map((week, idx) => {
          return <Week key={idx} week={week} />;
        })}
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Timeline);
