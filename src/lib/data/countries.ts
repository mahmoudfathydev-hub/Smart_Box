export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = [
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "EG" },
  { code: "US", name: "United States", dialCode: "+1", flag: "US" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "GB" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "SA" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "AE" },
  { code: "JO", name: "Jordan", dialCode: "+962", flag: "JO" },
  { code: "LB", name: "Lebanon", dialCode: "+961", flag: "LB" },
  { code: "QA", name: "Qatar", dialCode: "+974", flag: "QA" },
  { code: "KW", name: "Kuwait", dialCode: "+965", flag: "KW" },
  { code: "BH", name: "Bahrain", dialCode: "+973", flag: "BH" },
  { code: "OM", name: "Oman", dialCode: "+968", flag: "OM" },
  { code: "IQ", name: "Iraq", dialCode: "+964", flag: "IQ" },
  { code: "SY", name: "Syria", dialCode: "+963", flag: "SY" },
  { code: "PS", name: "Palestine", dialCode: "+970", flag: "PS" },
  { code: "DZ", name: "Algeria", dialCode: "+213", flag: "DZ" },
  { code: "MA", name: "Morocco", dialCode: "+212", flag: "MA" },
  { code: "TN", name: "Tunisia", dialCode: "+216", flag: "TN" },
  { code: "LY", name: "Libya", dialCode: "+218", flag: "LY" },
  { code: "SD", name: "Sudan", dialCode: "+249", flag: "SD" },
  { code: "YE", name: "Yemen", dialCode: "+967", flag: "YE" },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "TR" },
  { code: "IR", name: "Iran", dialCode: "+98", flag: "IR" },
  { code: "AF", name: "Afghanistan", dialCode: "+93", flag: "AF" },
  { code: "PK", name: "Pakistan", dialCode: "+92", flag: "PK" },
  { code: "IN", name: "India", dialCode: "+91", flag: "IN" },
  { code: "CN", name: "China", dialCode: "+86", flag: "CN" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "JP" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "KR" },
  { code: "RU", name: "Russia", dialCode: "+7", flag: "RU" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "DE" },
  { code: "FR", name: "France", dialCode: "+33", flag: "FR" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "IT" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "ES" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "NL" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "BE" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "CH" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "AT" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "SE" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "NO" },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "DK" },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "FI" },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "PL" },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "CZ" },
  { code: "HU", name: "Hungary", dialCode: "+36", flag: "HU" },
  { code: "RO", name: "Romania", dialCode: "+40", flag: "RO" },
  { code: "BG", name: "Bulgaria", dialCode: "+359", flag: "BG" },
  { code: "GR", name: "Greece", dialCode: "+30", flag: "GR" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "PT" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "CA" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "MX" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "BR" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "AR" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "CL" },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "CO" },
  { code: "PE", name: "Peru", dialCode: "+51", flag: "PE" },
  { code: "VE", name: "Venezuela", dialCode: "+58", flag: "VE" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "AU" },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "NZ" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "ZA" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "NG" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "KE" },
  { code: "UG", name: "Uganda", dialCode: "+256", flag: "UG" },
  { code: "TZ", name: "Tanzania", dialCode: "+255", flag: "TZ" },
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "GH" },
  { code: "SN", name: "Senegal", dialCode: "+221", flag: "SN" },
  { code: "CI", name: "Ivory Coast", dialCode: "+225", flag: "CI" },
  { code: "CM", name: "Cameroon", dialCode: "+237", flag: "CM" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "TH" },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "VN" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "PH" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "MY" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "SG" },
];

export const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find((country) => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return countries.find((country) => country.dialCode === dialCode);
};

export const getDefaultCountry = (): Country => {
  return countries[0]; // Egypt as default
};
