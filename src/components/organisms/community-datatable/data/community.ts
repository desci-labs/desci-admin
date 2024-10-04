export const communities = Array.from({ length: 100 }, (_, index) => ({
  id: 9000 + index,
  name: `Institution ${index}`,
  subtitle: `Research and Development ${index}`,
  description: `Exploring advanced technologies and innovations at Institution ${index}.`,
  hidden: false,
  keywords: ["research", "innovation", "technology", "institution"],
  image_url: `https://pub.desci.com/ipfs/bafkreie7kxhzpzhsbywcrpgyv5yvy3qxcjsibuxsnsh5olaztl2uvnrzx4`,
  slug: `institution-${index}`,
  links: [
    `https://example.com/resource${index * 2 + 1}`,
    `https://example.com/resource${index * 2 + 2}`
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

