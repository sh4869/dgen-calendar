import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import "./index.css";
import { Header } from "./header";
import { YearMonth } from "./yearmonth";

dayjs.extend(weekday);

type Diary = {
  title: string;
  url: string;
};

type Diaries = { [key: string]: Diary };

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
  current: YearMonth;
  diary?: Diary;
};

const Day = ({ day, current, diary }: DayProps) => {
  const isCurrentMonth = day.month() == current.month;
  const isToday = isCurrentMonth && dayjs().date() == day.date();
  const todayName = [
    "font-date",
    "text-base",
    dayColor(day.day(), isCurrentMonth),
    `${isToday ? "underline decoration-slate-500 font-bold" : ""}`,
  ].join(" ");
  const bg = isCurrentMonth ? "bg-[#dfdfdf]" : "bg-[#e3e3e3]";
  const txt = window.innerWidth > 600 ? diary?.title : "📋";
  return (
    <div className={`m-1 p-2 w-32 h-32 ${bg}`}>
      <p className={todayName}>
        {day.date() == 1 ? day.format("M/D") : day.date()}
      </p>
      {isCurrentMonth && diary && (
        <p className="my-1 text-center">
          <a href={diary.url} className="text-black hover:underline">
            {txt}
          </a>
        </p>
      )}
    </div>
  );
};

const fetchIndex = async (year: number): Promise<Diaries> => {
  try {
    return (await fetch(`/indexes/${year.toString()}.json`).then((_) =>
      _.json()
    )) as Diaries;
  } catch {
    return {};
  }
};

// 年月からその月のカレンダーを構成するのに必要な日を週ごとの配列にして返します
const getCalendarDays = (ym: YearMonth): dayjs.Dayjs[][] => {
  const firstDayOfMonth = dayjs(`${ym.toString()}-1`);
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

const App = () => {
  const [currentYM, setCurrentYM] = useState<YearMonth>(YearMonth.current());
  const [indexes, setIndexes] = useState<{ [key: string]: Diaries }>({});

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

  useEffect(() => {
    const params = window.location.href.split("#");
    if (params.length > 1) {
      const ym = YearMonth.fromString(params[1]);
      if (ym) setCurrentYM(ym);
    }
  }, []);

  const setParam = (ym: YearMonth) => {
    window.location.href =
      window.location.href.split("#")[0] + "#" + ym.toString();
  };

  const onBack = () => {
    const b = currentYM.back();
    setParam(b);
    setCurrentYM(b);
  };

  const onNext = () => {
    const n = currentYM.next();
    setParam(n);
    setCurrentYM(n);
  };

  return (
    <div>
      <Header />
      <h2 className="text-center text-3xl m-4 font-header">
        {currentYM.year}-{currentYM.month + 1}
      </h2>
      <div className="flex justify-evenly">
        <button className="ml-20 font-header text-xl" onClick={onBack}>
          back
        </button>
        <button className="mr-20 font-header text-xl" onClick={onNext}>
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
                  diary={
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
};

export default App;
