import { DateValue } from "@internationalized/date"

export function validateCalendar(object: DateValue): object is DateValue {
  return !!object
}