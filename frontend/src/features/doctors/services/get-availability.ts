import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import type { DoctorDto as Doctor } from "@/api/schemas";

dayjs.extend(utc);
dayjs.locale("pt-br");

const buildUtcDateForWeekDay = (weekDay: number, time: string) => {
  const [hour = "0", minute = "0", second = "0"] = time.split(":");

  return dayjs
    .utc("2020-01-05T00:00:00Z")
    .day(weekDay)
    .set("hour", Number(hour))
    .set("minute", Number(minute))
    .set("second", Number(second));
};

export const getAvailability = (doctor: Doctor) => {
  const from = buildUtcDateForWeekDay(
    doctor.availableFromWeekDay,
    doctor.availableFromTime,
  );
  const to = buildUtcDateForWeekDay(
    doctor.availableToWeekDay,
    doctor.availableToTime,
  );

  return { from, to };
};
