export type RemittanceCorridor = {
  id: string;
  fromCountry: string;
  fromCountryCode: string;
  toCountry: string;
  toCountryCode: string;
  toCurrency: string;
  flag: string;
  /** Demo AED per 1 USDC — illustrative testnet rate only */
  aedPerUsdc: number;
  /** Typical traditional remittance fee % for comparison */
  traditionalFeePercent: number;
  /** Demo platform fee in USDC */
  platformFeeUsdc: number;
  estimatedMinutesTraditional: number;
  destinationChain: "arcTestnet";
  popular: boolean;
};

export const AED_PER_USDC_DEFAULT = 3.6725;

export const REMITTANCE_CORRIDORS: RemittanceCorridor[] = [
  {
    id: "uae-india",
    fromCountry: "United Arab Emirates",
    fromCountryCode: "AE",
    toCountry: "India",
    toCountryCode: "IN",
    toCurrency: "INR",
    flag: "🇮🇳",
    aedPerUsdc: 3.6725,
    traditionalFeePercent: 5.5,
    platformFeeUsdc: 0.75,
    estimatedMinutesTraditional: 2880,
    destinationChain: "arcTestnet",
    popular: true,
  },
  {
    id: "uae-pakistan",
    fromCountry: "United Arab Emirates",
    fromCountryCode: "AE",
    toCountry: "Pakistan",
    toCountryCode: "PK",
    toCurrency: "PKR",
    flag: "🇵🇰",
    aedPerUsdc: 3.6725,
    traditionalFeePercent: 6.2,
    platformFeeUsdc: 0.75,
    estimatedMinutesTraditional: 4320,
    destinationChain: "arcTestnet",
    popular: true,
  },
  {
    id: "uae-philippines",
    fromCountry: "United Arab Emirates",
    fromCountryCode: "AE",
    toCountry: "Philippines",
    toCountryCode: "PH",
    toCurrency: "PHP",
    flag: "🇵🇭",
    aedPerUsdc: 3.6725,
    traditionalFeePercent: 4.8,
    platformFeeUsdc: 0.75,
    estimatedMinutesTraditional: 1440,
    destinationChain: "arcTestnet",
    popular: true,
  },
  {
    id: "uae-bangladesh",
    fromCountry: "United Arab Emirates",
    fromCountryCode: "AE",
    toCountry: "Bangladesh",
    toCountryCode: "BD",
    toCurrency: "BDT",
    flag: "🇧🇩",
    aedPerUsdc: 3.6725,
    traditionalFeePercent: 5.0,
    platformFeeUsdc: 0.75,
    estimatedMinutesTraditional: 2880,
    destinationChain: "arcTestnet",
    popular: false,
  },
  {
    id: "uae-egypt",
    fromCountry: "United Arab Emirates",
    fromCountryCode: "AE",
    toCountry: "Egypt",
    toCountryCode: "EG",
    toCurrency: "EGP",
    flag: "🇪🇬",
    aedPerUsdc: 3.6725,
    traditionalFeePercent: 5.8,
    platformFeeUsdc: 0.75,
    estimatedMinutesTraditional: 2160,
    destinationChain: "arcTestnet",
    popular: false,
  },
  {
    id: "uae-nepal",
    fromCountry: "United Arab Emirates",
    fromCountryCode: "AE",
    toCountry: "Nepal",
    toCountryCode: "NP",
    toCurrency: "NPR",
    flag: "🇳🇵",
    aedPerUsdc: 3.6725,
    traditionalFeePercent: 5.3,
    platformFeeUsdc: 0.75,
    estimatedMinutesTraditional: 2880,
    destinationChain: "arcTestnet",
    popular: false,
  },
];

export function getCorridorById(id: string): RemittanceCorridor | undefined {
  return REMITTANCE_CORRIDORS.find((c) => c.id === id);
}