export const demoAccounts = [
  { role: "Admin", email: "admin@airportmanager.dev", password: "admin12345" },
  { role: "Crew", email: "crew@airportmanager.dev", password: "crew12345" },
  { role: "Passenger", email: "passenger@airportmanager.dev", password: "passenger12345" },
];

export const statusTone = {
  BOARDING: "boarding",
  DELAYED: "delayed",
  CANCELLED: "cancelled",
  ON_TIME: "on-time",
  SCHEDULED: "scheduled",
};

export function formatDateTime(value) {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatRole(role) {
  return role.replaceAll("_", " ");
}
