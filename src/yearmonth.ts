import dayjs from "dayjs";

export class YearMonth {
  public year: number;
  public month: number;

  public constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  public next(): YearMonth {
    return new YearMonth(
      this.month == 11 ? this.year + 1 : this.year,
      this.month == 11 ? 0 : this.month + 1
    );
  }

  public back(): YearMonth {
    return new YearMonth(
      this.month == 0 ? this.year - 1 : this.year,
      this.month == 0 ? 11 : this.month - 1
    );
  }

  public toString(): string {
    return `${this.year}-${this.month + 1}`;
  }

  static fromString(str: string): YearMonth | undefined {
    const tmp = str.split("-");
    if (tmp.length !== 2) return;
    const ym = new YearMonth(Number(tmp[0]), Number(tmp[1]) - 1);
    if (isNaN(ym.month) || isNaN(ym.year)) return;
    return ym;
  }

  static current(): YearMonth {
    return new YearMonth(dayjs().year(), dayjs().month());
  }
}
