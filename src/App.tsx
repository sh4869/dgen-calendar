import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import "./index.css";

dayjs.extend(weekday);

type Diary = {
  title: string;
  url: string;
};

type Indexes = { [key: string]: Diary };

type YM = {
  year: number;
  month: number;
};

const back = (currentYM: YM): YM => ({
  year: currentYM.month == 0 ? currentYM.year - 1 : currentYM.year,
  month: currentYM.month == 0 ? 11 : currentYM.month - 1,
});

const next = (currentYM: YM): YM => ({
  year: currentYM.month == 11 ? currentYM.year + 1 : currentYM.year,
  month: currentYM.month == 11 ? 0 : currentYM.month + 1,
});

const dayColor = (day: number, isCurrent: boolean) => {
  switch (day) {
    case 0:
      return isCurrent ? `text-red-600` : `text-red-400`;
    case 6:
      return isCurrent ? `text-blue-600` : `text-red-400`;
    default:
      return isCurrent ? `text-slate-800` : `text-slate-400`;
  }
};

type DayProps = {
  day: dayjs.Dayjs;
  current: { year: number; month: number };
  index?: Diary;
};

const Day = ({ day, current, index }: DayProps) => {
  const isCurrentMonth = day.month() == current.month;
  const isToday = isCurrentMonth && dayjs().date() == day.date();
  const todayName = [
    "font-date",
    "text-base",
    dayColor(day.day(), isCurrentMonth),
    `${isToday ? "underline decoration-slate-500 font-bold" : ""}`,
  ].join(" ");
  const bg = isCurrentMonth ? "bg-[#dfdfdf]" : "bg-[#e3e3e3]";
  const txt = window.innerWidth > 400 ? index?.title : "📋";
  return (
    <div className={`m-1 p-2 w-32 h-32 ${bg}`}>
      <p className={todayName}>
        {day.date() == 1 ? day.format("M/D") : day.date()}
      </p>
      {isCurrentMonth && index && (
        <p className="my-1 text-center">
          <a href={index.url} className="text-black hover:underline">
            {txt}
          </a>
        </p>
      )}
    </div>
  );
};

const fetchIndex = async (year: number): Promise<Indexes> => {
  try {
    return (await fetch(`/indexes/${year.toString()}.json`).then((_) =>
      _.json()
    )) as Indexes;
  } catch {
    return {};
  }
};

// 年月からその月のカレンダーを構成するのに必要な日を週ごとの配列にして返します
const getCalendarDays = (ym: YM): dayjs.Dayjs[][] => {
  const firstDayOfMonth = dayjs(`${ym.year}-${ym.month + 1}-1`);
  const first = firstDayOfMonth.weekday(0);
  const last = firstDayOfMonth.date(firstDayOfMonth.daysInMonth()).weekday(7);
  return new Array(last.diff(first, "day"))
    .fill(0)
    .map((_, i) => first.clone().add(i, "day"))
    .reduce<dayjs.Dayjs[][]>(
      (p, c, i) => {
        // 7日ごとに次の週に分割
        if (i % 7 == 0) return [...p, [c]];
        const remain = p.slice(0, p.length - 1);
        const last = p[p.length - 1];
        return [...remain, [...last, c]];
      },
      [[]]
    );
};

function App() {
  const [currentYM, setCurrentYM] = useState<YM>({
    year: dayjs().year(),
    month: dayjs().month(),
  });
  const [indexes, setIndexes] = useState<{ [key: string]: Indexes }>({});

  useEffect(() => {
    (async () => {
      const y = currentYM.year.toString();
      if (!indexes[y]) {
        const v = await fetchIndex(currentYM.year);
        indexes[y] = v;
        setIndexes({ ...indexes });
      }
    })();
  }, [currentYM.year]);

  return (
    <div>
      <div className="flex">
        <div id="header" className="font-header basis-full">
          <a href="/" className="mx-auto">
            <h1 className="title font-bold">Daily Bread</h1>
          </a>
          <p className="text-center">It is only a paper moon</p>
          <div className="link">
            <p>
              <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
                rss
              </a>
            </p>
            <p>
              <a href="/calendar" target="_blank" rel="noopener noreferrer">
                calendar
              </a>
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-center text-3xl m-4 font-header">
        {currentYM.year}-{currentYM.month + 1}
      </h2>
      <div className="flex justify-evenly">
        <button
          className="ml-20 font-header text-xl"
          onClick={() => setCurrentYM(back(currentYM))}
        >
          back
        </button>
        <button
          className="mr-20 font-header text-xl"
          onClick={() => setCurrentYM(next(currentYM))}
        >
          next
        </button>
      </div>
      <div className="my-10">
        {getCalendarDays(currentYM).map((v, i) => (
          <div key={i} className="flex justify-evenly">
            {v.map((v) => {
              return (
                <Day
                  key={v.format("YYYY/MM/DD")}
                  day={v}
                  current={currentYM}
                  index={
                    indexes[currentYM.year.toString()]?.[v.format("YYYY/MM/DD")]
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
