export function removeCurrentUnits(data: Array<any>): Array<any> {
  let currents = [];
  for (let series of data) {
    currents.push({
      name: series.name,
      value: series.y[series.y.length - 1],
    });
    series.x.pop();
    series.y.pop();
  }
  return [data, currents];
}
