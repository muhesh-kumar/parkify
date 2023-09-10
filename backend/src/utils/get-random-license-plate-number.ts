// Generates a valid Indian Vehicle Registration Number as per RTO rules
export default (): string => {
  // Part 1: Two-letter State Codes
  const stateCodes = [
    'AP',
    'AR',
    'AS',
    'BR',
    'CG',
    'GA',
    'GJ',
    'HR',
    'HP',
    'JK',
    'JH',
    'KA',
    'KL',
    'MP',
    'MH',
    'MN',
    'ML',
    'MZ',
    'NL',
    'OD',
    'PB',
    'RJ',
    'SK',
    'TN',
    'TS',
    'TR',
    'UP',
    'UK',
    'WB',
    'AN',
    'CH',
    'DH',
    'DD',
    'DL',
    'LD',
    'PY',
  ];
  const stateCode = stateCodes[Math.floor(Math.random() * stateCodes.length)];

  // Part 2: District Number
  const districtNumber = String(Math.floor(Math.random() * 99)).padStart(
    2,
    '0'
  );

  // Part 3: Single or multiple alphabets
  const alphabetLength = Math.floor(Math.random() * 3) + 1;
  const alphabetChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let alphabet = '';
  for (let i = 0; i < alphabetLength; i++) {
    alphabet += alphabetChars[Math.floor(Math.random() * alphabetChars.length)];
  }

  // Part 4: Unique number between 1 and 9999
  const uniqueNumber = String(Math.floor(Math.random() * 9999) + 1).padStart(
    4,
    '0'
  );

  return `${stateCode} ${districtNumber} ${alphabet} ${uniqueNumber}`;
};
