import { invite } from "@/config/invite";

/** Convert local ISO string + timezone offset to UTC stamp format: YYYYMMDDTHHMMSSZ */
function toUtcStamp(local: string, offset: string): string {
  const d = new Date(`${local}${offset}`);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export const startStamp = toUtcStamp(invite.start, invite.timeZoneOffset);
export const endStamp = toUtcStamp(invite.end, invite.timeZoneOffset);

const formattedTitle = `${invite.groom} & ${invite.bride} Wedding Celebration`;
const formattedDetails = `${invite.invitationNote}\n\nVenue: ${invite.venue.name}, ${invite.venue.address}\nDate: ${invite.dayLine}, ${invite.timeLine}`;

export const googleCalendarUrl = [
  "https://calendar.google.com/calendar/render?action=TEMPLATE",
  `text=${encodeURIComponent(formattedTitle)}`,
  `dates=${startStamp}/${endStamp}`,
  `details=${encodeURIComponent(formattedDetails)}`,
  `location=${encodeURIComponent(`${invite.venue.name}, ${invite.venue.address}`)}`,
].join("&");

export const outlookCalendarUrl = [
  "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent",
  `subject=${encodeURIComponent(formattedTitle)}`,
  `startdt=${encodeURIComponent(`${invite.start}${invite.timeZoneOffset}`)}`,
  `enddt=${encodeURIComponent(`${invite.end}${invite.timeZoneOffset}`)}`,
  `body=${encodeURIComponent(formattedDetails)}`,
  `location=${encodeURIComponent(`${invite.venue.name}, ${invite.venue.address}`)}`,
].join("&");

export function downloadIcs() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitestory//Ankit & Bhavna Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${startStamp}-bhavna-ankit@invitestory.in`,
    `DTSTAMP:${startStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${formattedTitle}`,
    `DESCRIPTION:${formattedDetails.replace(/\n/g, "\\n")}`,
    `LOCATION:${invite.venue.name}\\, ${invite.venue.address}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: ${formattedTitle} Tomorrow!`,
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
  a.download = "bhavna-ankit-wedding.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
