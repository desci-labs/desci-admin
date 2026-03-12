/**
 * Script to generate IP range to institution mapping from ASN data
 * 
 * Usage: node tools/generate-institution-ip-map.js
 */

const fs = require("fs");
const path = require("path");

const ASN_LIST_PATH = path.join(__dirname, "asn-list.json");
const OUTPUT_PATH = path.join(__dirname, "../src/data/institution-ip-map.json");
const BGPVIEW_API = "https://api.bgpview.io/asn";
const RATE_LIMIT_DELAY = 1000; // 1 second between requests to be respectful

async function fetchPrefixesForAsn(asn) {
  const asnNumber = asn.replace("AS", "");
  const url = `${BGPVIEW_API}/${asnNumber}/prefixes`;
  
  console.log(`Fetching prefixes for ${asn}...`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${asn}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${asn}:`, error.message);
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateIpMap() {
  console.log("Loading ASN list...");
  const asnList = JSON.parse(fs.readFileSync(ASN_LIST_PATH, "utf-8"));
  
  const ipMap = {};
  let totalPrefixes = 0;
  
  for (const [region, asns] of Object.entries(asnList)) {
    console.log(`\nProcessing ${region} region...`);
    
    for (const [asn, name] of Object.entries(asns)) {
      const data = await fetchPrefixesForAsn(asn);
      
      if (data && data.data) {
        const ipv4Prefixes = data.data.ipv4_prefixes || [];
        const ipv6Prefixes = data.data.ipv6_prefixes || [];
        
        // Process IPv4 prefixes
        ipv4Prefixes.forEach((prefix) => {
          ipMap[prefix.prefix] = {
            name: name,
            region: region,
            country: prefix.country_code || region,
          };
          totalPrefixes++;
        });
        
        // Process IPv6 prefixes
        ipv6Prefixes.forEach((prefix) => {
          ipMap[prefix.prefix] = {
            name: name,
            region: region,
            country: prefix.country_code || region,
          };
          totalPrefixes++;
        });
        
        console.log(`  ${asn} (${name}): ${ipv4Prefixes.length} IPv4 + ${ipv6Prefixes.length} IPv6 prefixes`);
      }
      
      // Rate limiting
      await delay(RATE_LIMIT_DELAY);
    }
  }
  
  console.log(`\n✅ Total prefixes collected: ${totalPrefixes}`);
  console.log(`Writing to ${OUTPUT_PATH}...`);
  
  // Ensure directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(ipMap, null, 2),
    "utf-8"
  );
  
  console.log("✅ Institution IP map generated successfully!");
  console.log(`   Total institutions: ${Object.keys(asnList).reduce((sum, region) => sum + Object.keys(asnList[region]).length, 0)}`);
  console.log(`   Total IP prefixes: ${totalPrefixes}`);
}

// Run the script
generateIpMap().catch(console.error);

