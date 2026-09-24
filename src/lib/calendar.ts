import { invite } from "@/config/invite";

/** "2026-02-14T19:00:00" + "+05:30" -> "20260214T133000Z" */
function toUtcStamp(local: string, offset: string): string {
  const d = new Date(`${local}${offset}`);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export const startStamp = toUtcStamp(invite.start, invite.timeZoneOffset);
export const endStamp = toUtcStamp(invite.end, invite.timeZoneOffset);

export const googleCalendarUrl = [
  "https://calendar.google.com/calendar/render?action=TEMPLATE",
  `text=${encodeURIComponent(invite.eventTitle)}`,
  `dates=${startStamp}/${endStamp}`,
  `details=${encodeURIComponent(invite.invitationNote)}`,
  `location=${encodeURIComponent(`${invite.venue.name}, ${invite.venue.address}`)}`,
].join("&");

export function downloadIcs() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wedding-invite//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${startStamp}-invite@wedding`,
    `DTSTAMP:${startStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${invite.eventTitle}`,
    `DESCRIPTION:${invite.invitationNote}`,
    `LOCATION:${invite.venue.name}\\, ${invite.venue.address}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invitation.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
