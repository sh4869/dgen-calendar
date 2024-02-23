import { useEffect, useState } from "react";
import { Index, Indexes } from "./type";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);

const Day = ({
  day,
  current,
  index,
}: {
  day: dayjs.Dayjs;
  current: { year: number; month: number };
  index?: Index;
}) => {
  // TODO:
  return (
    <div style={{ width: "120px", height: "120px", padding: "1px" }}>
      <p style={{ textAlign: "left" }}>
        {day.date() == 1 ? day.format("M/D") : day.date()}
      </p>
      {index && (
        <h4>
          <a
            href={index.url}
            style={{ color: "black", textDecoration: "none" }}
          >
            {index?.title}
          </a>
        </h4>
      )}
    </div>
  );
};

function App() {
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month());
  const [indexes, setIndexes] = useState<{ [key: string]: Indexes }>({});

  useEffect(() => {
    (async () => {
      const y = year.toString();
      let res: Indexes;
      if (!indexes[y]) {
        try {
          res = (await fetch(`/assets/indexes/${year}.json`).then((_) =>
            _.json()
          )) as Indexes;
        } catch {
          res = {};
        }
        indexes[y] = res;
        setIndexes(indexes);
      }
    })();
  }, [year]);

  console.log(indexes);

  const currentMonth = dayjs(`${year}-${month + 1}-1`);
  const first = currentMonth.weekday(0);
  const last = currentMonth.date(currentMonth.daysInMonth()).weekday(7);
  const dates = new Array(last.diff(first, "day"))
    .fill(0)
    .map((_, i) => first.clone().add(i, "day"))
    .reduce<dayjs.Dayjs[][]>((p, c, i) => {
      if (p.length == 0) {
        return [[c]];
      }
      if (i % 7 == 0) {
        return [...p, [c]];
      }
      const remain = p.slice(0, p.length - 1);
      const last = p[p.length - 1];
      return [...remain, [...last, c]];
    }, []);

  return (
    <div className="App">
      <h2>
        {year}/{month}
      </h2>
      {dates.map((v) => (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {v.map((v) => (
            <Day
              day={v}
              current={{ year: year, month: month }}
              index={indexes[year.toString()]?.[v.format("YYYY/MM/DD")]}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
