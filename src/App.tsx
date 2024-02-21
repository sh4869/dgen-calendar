import { useState } from "react";
import "./App.css";
import dayjs from "dayjs";

const header = () => {};

function App() {
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month());

  const v = dayjs();

  return (
    <div className="App">
      <h1>
        {year}/{month}
      </h1>
    </div>
  );
}

export default App;
