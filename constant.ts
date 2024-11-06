export const companies = Array.from({ length: 500 }, (_, index) => {
  const id = index + 1;
  const getCompanyName = (num: number) => {
    let name = "Company ";
    if (num <= 26) {
      name += String.fromCharCode(64 + num);
    } else {
      const firstLetter = String.fromCharCode(64 + Math.floor((num - 1) / 26));
      const secondLetter = String.fromCharCode(65 + ((num - 1) % 26));
      name += firstLetter + secondLetter;
    }
    return name;
  };

  return {
    id,
    name: getCompanyName(id),
  };
});
