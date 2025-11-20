export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export const getInitials = (fullName) => {
  if (!fullName) return "";
  const words= fullName.trim().split(" ");
  let initials="";
  for(let i=0;i<Math.min(2,words.length);i++){
    initials+=words[i].charAt(0).toUpperCase();
  }
  return initials;
}

export const addThousandsSeperator = (number) => {
  if(number===null || isNaN(number)) return "";
  const [intgerPart,fractionPart]=number.toString().split(".");
  const formattedInteger=intgerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",");
  return fractionPart ? `${formattedInteger}.${fractionPart}` : formattedInteger;
}