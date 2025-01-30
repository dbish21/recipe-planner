type UnitGroup = {
  units: string[];
  conversions: { [key: string]: number };
};

const unitGroups: { [key: string]: UnitGroup } = {
  volume: {
    units: ['tsp', 'tbsp', 'cup', 'fl oz', 'ml', 'l'],
    conversions: {
      'tsp': 1,
      'tbsp': 3,
      'cup': 48,
      'fl oz': 6,
      'ml': 0.2,
      'l': 200
    }
  },
  weight: {
    units: ['oz', 'lb', 'g', 'kg'],
    conversions: {
      'oz': 1,
      'lb': 16,
      'g': 0.035274,
      'kg': 35.274
    }
  }
};

export const isConvertibleUnit = (unit: string): boolean => {
  return Object.values(unitGroups).some(group => 
    group.units.includes(unit.toLowerCase())
  );
};

export const getCompatibleUnits = (unit: string): string[] => {
  const group = Object.values(unitGroups).find(group => 
    group.units.includes(unit.toLowerCase())
  );
  return group ? group.units : [];
};

export const convertUnit = (
  amount: number,
  fromUnit: string,
  toUnit: string
): number | null => {
  const group = Object.values(unitGroups).find(group => 
    group.units.includes(fromUnit.toLowerCase()) && 
    group.units.includes(toUnit.toLowerCase())
  );

  if (!group) return null;

  const fromValue = group.conversions[fromUnit.toLowerCase()];
  const toValue = group.conversions[toUnit.toLowerCase()];

  return Number(((amount * fromValue) / toValue).toFixed(2));
};
