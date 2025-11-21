import institutionIpMap from "@/data/institution-ip-map.json";

export interface InstitutionInfo {
  name: string;
  region: string;
  country: string;
}

/**
 * Convert IP address to 32-bit integer
 */
function ipToInt(ip: string): number {
  const parts = ip.split(".");
  return (
    (parseInt(parts[0]) << 24) +
    (parseInt(parts[1]) << 16) +
    (parseInt(parts[2]) << 8) +
    parseInt(parts[3])
  );
}

/**
 * Check if IP address is in CIDR range
 */
function isIpInCidr(ip: string, cidr: string): boolean {
  // Handle IPv6 - for now, simple string prefix matching
  if (ip.includes(":") || cidr.includes(":")) {
    const [prefix] = cidr.split("/");
    return ip.startsWith(prefix.substring(0, Math.min(prefix.length, ip.length)));
  }
  
  // IPv4
  const [range, bits] = cidr.split("/");
  const mask = -1 << (32 - parseInt(bits));
  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);
  
  return (ipInt & mask) === (rangeInt & mask);
}

/**
 * Check if an IP belongs to an educational/research institution
 */
export function getInstitutionInfo(ip: string): InstitutionInfo | null {
  for (const [cidr, info] of Object.entries(institutionIpMap)) {
    if (isIpInCidr(ip, cidr)) {
      return info as InstitutionInfo;
    }
  }
  return null;
}

/**
 * Get country flag emoji from country code
 */
export function getCountryFlag(countryCode: string): string {
  // Handle special cases
  if (countryCode === "UK") {
    countryCode = "GB";
  }
  
  // Convert country code to flag emoji
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

