interface kv {
  k: string;
  v: any;
}
export function set(obj: Record<string, any>, kv: kv[]): Record<string, any> {
  const result = { ...obj };
  kv.forEach((v) => {
    result[v.k] = v.v;
  });
  return result;
}
