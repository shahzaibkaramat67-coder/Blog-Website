const earningCalculate = (views, rpm) => {
  if (!views || !rpm) return 0;

  const rpmMills = Math.round(rpm * 1000); // integer RPM
  const earningMills = Math.round((views * rpmMills) / 1000); // integer mills

  return earningMills; // still safe for DB & calculations
};


const DollerTomile = (ammount)=>{
    const miles = 1000;
    const amountInmile = ammount * miles;
     return amountInmile;
}
const milesToDoller = (ammount)=>{
    const miles = 1000;
    const amountInmile = ammount / miles;
     return amountInmile;
}



export  {
  earningCalculate,
  DollerTomile,
  milesToDoller
};
