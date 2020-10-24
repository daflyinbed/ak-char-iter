export function parseMD(str: string): [number, number] {
  const result = /(.*?)月(.*?)日/.exec(str);
  if (result?.length == 3) {
    if (isNaN(parseInt(result[1])) || isNaN(parseInt(result[2]))) {
      console.error("parse error: " + str);
      return [0, 0];
    }
    return [parseInt(result[1]), parseInt(result[2])];
  } else {
    console.error("parse error: " + str);
    return [0, 0];
  }
}
