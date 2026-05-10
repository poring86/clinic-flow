"use server";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";


dayjs.extend(utc);
dayjs.extend(timezone);

export const getAvailableTimesAction = async (doctorId: string, date: string) => {
  // Monta a URL com query params
  const url = `/appointment?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}`;
  const res = await fetch(url, { method: "GET" });
  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data = body ? JSON.parse(body) : undefined;
  return data;
};
