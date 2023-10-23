const formatDate = (date: string) => {
  const convertedDate = new Date(date);

  let day = convertedDate.getDate().toString();
  let month = (convertedDate.getMonth() + 1).toString();
  let year = convertedDate.getFullYear().toString();
  let hour = convertedDate.getHours().toString();
  let minutes = convertedDate.getMinutes().toString();

  if (day.length === 1) {
    day = "0" + day;
  }
  if (month.length === 1) {
    month = "0" + month;
  }
  if (year.length === 1) {
    year = "0" + year;
  }
  if (hour.length === 1) {
    hour = "0" + hour;
  }
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }

  return `${day}/${month}/${year} ${hour}:${minutes}`;
};

export { formatDate };
