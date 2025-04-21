export const formatNumber = (num: number |null) => {
  if (num===null) return null;
  let display = num.toString();

  if (num >= 1_000_000_000) {
    display = (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    display = (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    display = (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return <span title={num.toLocaleString()}>{display}</span>;
};
