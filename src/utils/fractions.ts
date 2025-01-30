const gcd = (a: number, b: number): number => {
  return b ? gcd(b, a % b) : a;
};

export const decimalToFraction = (decimal: number): string => {
  if (decimal === Math.floor(decimal)) {
    return decimal.toString();
  }

  const tolerance = 1.0E-6;
  let numerator = 1;
  let denominator = 1;
  let fraction = numerator / denominator;
  
  while (Math.abs(fraction - decimal) > tolerance) {
    if (fraction < decimal) {
      numerator++;
    } else {
      denominator++;
      numerator = Math.round(decimal * denominator);
    }
    fraction = numerator / denominator;
  }

  const wholePart = Math.floor(numerator / denominator);
  numerator = numerator % denominator;

  if (wholePart > 0) {
    return numerator === 0 ? `${wholePart}` : `${wholePart} ${numerator}/${denominator}`;
  }
  
  return `${numerator}/${denominator}`;
};

// Common cooking fractions for reference
export const commonFractions = [
  '1/4', '1/3', '1/2', '2/3', '3/4',
  '1/8', '3/8', '5/8', '7/8',
  '1/16', '3/16', '5/16', '7/16', '9/16', '11/16', '13/16', '15/16'
];
