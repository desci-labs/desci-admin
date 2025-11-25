import ipaddr from "ipaddr.js";
import institutionIpMap from "@/data/institution-ip-map.json";

export interface InstitutionInfo {
  name: string;
  region: string;
  country: string;
}

/**
 * Check if IP address is in CIDR range
 * Handles both IPv4 and IPv6 using ipaddr.js
 */
function isIpInCidr(ip: string, cidr: string): boolean {
  try {
    const parsedIp = ipaddr.process(ip);
    const [rangeStr, prefixLengthStr] = cidr.split("/");
    const parsedRange = ipaddr.process(rangeStr);
    const prefixLength = parseInt(prefixLengthStr);
    
    // Both IP and range must be the same type (IPv4 or IPv6)
    if (parsedIp.kind() !== parsedRange.kind()) {
      return false;
    }
    
    return parsedIp.match(parsedRange, prefixLength);
  } catch (error) {
    // Return false on invalid input
    return false;
  }
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

