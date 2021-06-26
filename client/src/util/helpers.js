export const parseTimestampToDate = (timestamp) => {
  const rawdate = timestamp.split("T")[0].split("-");

  if (rawdate.length !== 3) {
    console.error("Received invalid timestamp:", timestamp);
    return;
  }

  const date = new Date(rawdate[0], rawdate[1], rawdate[2]);
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
};

export const parseDateToTimestamp = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const timestamp = `${date.getFullYear()}-${month.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  })}-${day.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`;
  return timestamp;
};
