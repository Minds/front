export default function addressExcerpt(address) {
  return `0×${address.substr(2, 5)}...${address.substr(-5)}`;
}
