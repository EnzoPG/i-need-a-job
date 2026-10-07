type CountryRule = {
  code: string;
  keywords: string[];
};

const COUNTRY_RULES: CountryRule[] = [
  {
    code: "gb",
    keywords: [
      "uk",
      "united kingdom",
      "great britain",
      "england",
      "london",
      "scotland",
      "wales",
      "manchester",
    ],
  },
  {
    code: "ca",
    keywords: ["canada", "toronto", "vancouver", "montreal", "ottawa", "ontario"],
  },
  {
    code: "au",
    keywords: ["australia", "sydney", "melbourne", "brisbane", "perth"],
  },
  {
    code: "de",
    keywords: ["germany", "deutschland", "berlin", "munich", "frankfurt"],
  },
  {
    code: "fr",
    keywords: ["france", "paris", "lyon"],
  },
  {
    code: "nl",
    keywords: ["netherlands", "holland", "amsterdam", "rotterdam"],
  },
  {
    code: "in",
    keywords: ["india", "bangalore", "bengaluru", "mumbai", "delhi", "hyderabad"],
  },
  {
    code: "br",
    keywords: ["brazil", "brasil", "sao paulo"],
  },
  {
    code: "it",
    keywords: ["italy", "italia", "milan", "rome"],
  },
  {
    code: "es",
    keywords: ["spain", "espana", "madrid", "barcelona"],
  },
  {
    code: "nz",
    keywords: ["new zealand", "auckland", "wellington"],
  },
  {
    code: "za",
    keywords: ["south africa", "johannesburg", "cape town"],
  },
  {
    code: "sg",
    keywords: ["singapore"],
  },
  {
    code: "ch",
    keywords: ["switzerland", "zurich", "geneva"],
  },
  {
    code: "at",
    keywords: ["austria", "vienna"],
  },
  {
    code: "be",
    keywords: ["belgium", "brussels"],
  },
  {
    code: "mx",
    keywords: ["mexico"],
  },
];

/**
 * Maps location search strings to supported Adzuna two-letter country codes.
 * Uses a single unified keyword validation across mapped country arrays.
 * Defaults to 'us' when no match is detected.
 */
export function detectCountryCode(location?: string): string {
  if (!location) return "us";

  const loc = location.toLowerCase().trim();

  const matched = COUNTRY_RULES.find((rule) =>
    rule.keywords.some((keyword) => loc.includes(keyword))
  );

  return matched?.code || "us";
}
