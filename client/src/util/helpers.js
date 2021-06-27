export const parseTimestampToDate = (timestamp) => {
  const rawdate = timestamp.split("T")[0].split("-");

  if (rawdate.length !== 3) {
    console.error("Received invalid timestamp:", timestamp);
    return;
  }

  return new Date(rawdate[0], rawdate[1] - 1, rawdate[2]);
};

export const parseDateToUIString = (date) => {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

export const parseDateToTimestamp = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const timestamp = `${date.getFullYear()}-${month.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  })}-${day.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`;
  return timestamp;
};

export const getNumOfVaccinesExpiredBy = async (brand, timestamp) => {
  const date = parseTimestampToDate(timestamp);
  const dateOfArrivalForOrdersExpiredToday = new Date(
    new Date(date.setDate(date.getDate() - 30))
  );

  const newTimestamp = parseDateToTimestamp(dateOfArrivalForOrdersExpiredToday);

  const expiredBottles = await fetch(
    `/orders?brand=${encodeURIComponent(brand)}&before=${encodeURIComponent(
      newTimestamp
    )}`,
    { method: "GET", headers: { Accept: "application/json" } }
  ).then(defaultResponseHandler);

  const vaccinationsDone = await fetch(`/vaccinations`).then(
    defaultResponseHandler
  );

  let expiredDoses = 0;
  let emptyBottles = 0;

  expiredBottles.forEach((bottle) => {
    vaccinationsDone.forEach((vax) => {
      if (vax.sourceBottle === bottle.id) {
        bottle.injections--;
      }
    });

    expiredDoses += bottle.injections;

    if (bottle.injections === 0) {
      emptyBottles++;
    }
  });

  return { expiredBottles: expiredBottles.length - emptyBottles, expiredDoses };
};

export const defaultResponseHandler = async (res) => {
  if (res.status === 200) {
    return res.json();
  }

  console.error("Error fetching response:", res.statusText);
};

export const capitalize = (str) => {
  if (str.length < 1) return "";
  return str[0].toUpperCase() + str.slice(1);
};
