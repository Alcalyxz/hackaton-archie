import type { BookingsVM } from "@/application/view-models/bookings.vm";

export function BookingsView(props: BookingsVM) {
  return <ul data-vid="wxwbwuj">{props.bookings.map((b) => <li data-vid="o90vknh" key={b.id}>{b.status}</li>)}</ul>;
}
