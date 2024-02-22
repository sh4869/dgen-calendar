import { useState } from "react";
import "./App.css";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);

const header = () => {};

function App() {
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month());
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
  console.log(first, last);
  console.log(dates);
  return (
    <div className="App">
      <h1>
        {year}/{month}
      </h1>
      {dates.map((v) => (
        <div>
          {v.map((v) => (
            <div style={{ display: "inline-block", width: "50px" }}>
              {v.format("MM/DD")}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
