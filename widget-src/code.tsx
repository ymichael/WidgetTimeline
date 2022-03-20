import { TMonth, TWeek, getMonthAndWeeks } from "../shared/timeUtils"

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

type TTheme = {
  MONTH_FILL: string;
  WEEK_FILL: string;
};

type TSize = {
  DAY_WIDTH: number;
  SPACING: number;
  PADDING: number;
  FONT_SIZE_WEEK: number;
  FONT_SIZE_MONTH: number;
};

const SIZE_MAP: Record<string, TSize> = {
  small: {
    DAY_WIDTH: 40,
    SPACING: 10,
    PADDING: 15,
    FONT_SIZE_MONTH: 42,
    FONT_SIZE_WEEK: 32,
  },
  medium: {
    DAY_WIDTH: 80,
    SPACING: 15,
    PADDING: 20,
    FONT_SIZE_MONTH: 62,
    FONT_SIZE_WEEK: 52,
  },
  large: {
    DAY_WIDTH: 120,
    SPACING: 20,
    PADDING: 30,
    FONT_SIZE_MONTH: 82,
    FONT_SIZE_WEEK: 72,
  },
};

const THEMES: Record<string, TTheme> = {
  Orange: { MONTH_FILL: "#FAAB13", WEEK_FILL: "#FFEDCA" },
  Pink: { MONTH_FILL: "#FF70F9", WEEK_FILL: "#FFBBFC" },
  Red: { MONTH_FILL: "#FF4747", WEEK_FILL: "#FDC5C5" },
  Teal: { MONTH_FILL: "#29D3A0", WEEK_FILL: "#B9FFEA" },
  Green: { MONTH_FILL: "#36CE1D", WEEK_FILL: "#C5F2D2" },
  Olive: { MONTH_FILL: "#00700B", WEEK_FILL: "#98D69E" },
  Blue: { MONTH_FILL: "#3683C9", WEEK_FILL: "#D1E5F8" },
  Navy: { MONTH_FILL: "#0012B8", WEEK_FILL: "#A0A7E4" },
  Purple: { MONTH_FILL: "#9747ff", WEEK_FILL: "#eadaff" },
  Black: { MONTH_FILL: "#2A2A2A", WEEK_FILL: "#CCCCCC" },
};

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

function Month({
  month,
  theme,
  size,
  large,
  children,
}: {
  month: TMonth;
  theme: TTheme;
  size: TSize;
  large: boolean;
  children?: any;
  key?: any;
}) {
  let label = MONTH_IDX_TO_NAME[month.monthIdx];
  if (month.numDays <= 7) {
    label = label.slice(0, 3);
  }
  return (
    <AutoLayout
      width={size.DAY_WIDTH * month.numDays}
      direction="vertical"
      padding={{ horizontal: size.SPACING }}
    >
      <AutoLayout
        width="fill-parent"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        padding={size.PADDING}
        cornerRadius={10}
        fill={theme.MONTH_FILL}
      >
        <Text
          fill="#FFF"
          fontFamily="Inter"
          fontSize={large ? size.FONT_SIZE_MONTH * 2 : size.FONT_SIZE_MONTH}
          fontWeight={500}
        >
          {label}
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

function Week({
  week,
  size,
  theme,
}: {
  week: TWeek;
  size: TSize;
  theme: TTheme;
  key?: any;
}) {
  return (
    <AutoLayout
      width={size.DAY_WIDTH * week.numDays}
      padding={{ horizontal: size.SPACING }}
      direction="vertical"
    >
      <AutoLayout
        width="fill-parent"
        fill={theme.WEEK_FILL}
        cornerRadius={10}
        padding={size.PADDING}
        verticalAlignItems="center"
        horizontalAlignItems="center"
      >
        <Text fontFamily="Inter" fontSize={size.FONT_SIZE_WEEK}>
          {week.fromStr} - {week.toStr}
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

const today = new Date();
const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);

const dateTrunc = (x) => x.split(" ").slice(1, 4).join(" ");

function Timeline() {
  const [theme, setTheme] = useSyncedState<TTheme>("theme", THEMES["Purple"]);
  const [sizeKey, setSizeKey] = useSyncedState<string>("sizeKey", "small");
  const [from, setFrom] = useSyncedState("from", today.toString());
  const [to, setTo] = useSyncedState("to", nextMonth.toString());
  const [showWeeks, setShowWeeks] = useSyncedState("showWeeks", true);

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const showDatePicker = (): Promise<void> => {
    return new Promise(() => {
      figma.showUI(
        `
          <script>
            window.defaultDateFrom = ${JSON.stringify(from)}
            window.defaultDateTo = ${JSON.stringify(to)}
          </script>
          ${__html__}
        `,
        {
          width: 516,
          height: 300,
        }
      );
    });
  };

  usePropertyMenu(
    [
      {
        itemType: "color-selector",
        tooltip: "Theme",
        propertyName: "setTheme",
        selectedOption: theme.MONTH_FILL,
        options: Object.entries(THEMES).map(([k, v]) => {
          return { option: v.MONTH_FILL, tooltip: k };
        }),
      },
      {
        itemType: "dropdown",
        tooltip: "Size",
        propertyName: "setSize",
        selectedOption: sizeKey,
        options: Object.keys(SIZE_MAP).map((k) => {
          const label = k[0].toUpperCase() + k.slice(1);
          return { option: k, label };
        }),
      },
      { itemType: "separator" },
      {
        itemType: "action",
        tooltip: showWeeks ? "Hide Weeks" : "Show Weeks",
        propertyName: "toggleShowWeeks",
      },
      { itemType: "separator" },
      {
        itemType: "action",
        tooltip: `${dateTrunc(from)} - ${dateTrunc(to)}`,
        propertyName: "setRange",
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "setRange") {
        return showDatePicker();
      } else if (propertyName === "setSize") {
        if (SIZE_MAP[propertyValue]) {
          setSizeKey(propertyValue);
        }
      } else if (propertyName === "toggleShowWeeks") {
        setShowWeeks(!showWeeks);
      } else if (propertyName === "setTheme") {
        const selectedTheme = Object.values(THEMES).find((v) => {
          return v.MONTH_FILL === propertyValue;
        });
        if (selectedTheme) {
          setTheme(selectedTheme);
        }
      }
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
  const size = SIZE_MAP[sizeKey] || SIZE_MAP["small"];
  return (
    <AutoLayout direction="vertical" spacing={size.SPACING}>
      <AutoLayout direction="horizontal" padding={0} spacing={0}>
        {months.map((month) => {
          return (
            <Month
              key={month.monthIdx}
              month={month}
              size={size}
              large={!showWeeks}
              theme={theme}
            />
          );
        })}
      </AutoLayout>
      {showWeeks && (
        <AutoLayout direction="horizontal" padding={0} spacing={0}>
          {weeks.map((week, idx) => {
            return <Week key={idx} week={week} theme={theme} size={size} />;
          })}
        </AutoLayout>
      )}
    </AutoLayout>
  );
}

widget.register(Timeline);
