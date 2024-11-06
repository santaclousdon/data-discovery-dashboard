export const companies = Array.from({ length: 500 }, (_, index) => {
  const id = index + 1;
  /**
   * Generates a company name based on a number
   * For 1-26: Returns "Company A" through "Company Z"
   * For >26: Returns "Company AA" through "Company ZZ"
   * @param num - The number to convert to a company name
   */
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
