import { useState } from "react";
import { matchSorter } from "match-sorter";
import { useDebounce } from "./useDebounce";
export interface FilterFunc {
  (value: any): boolean;
}
export interface Filter {
  filter?: "include" | "equal" | "between" | "fuzzyText" | FilterFunc;
  data: any;
}
export interface Data {
  _id: string;
  [propName: string]: any;
}
export type Order = undefined | "asc" | "desc";
export interface Orders {
  order: Order;
  id: string;
}
function betweenFilter(min: number, max: number, value: number): boolean {
  return value <= max && value >= min;
}
function includeFilter<T>(arr: T[], value: T): boolean {
  return arr.length == 0 || arr.includes(value);
}
function equalFilter<T>(state: T, value: T): boolean {
  return state == value;
}
function fuzzyTextFilter(state: string, value: string): boolean {
  return matchSorter([value], state).length != 0;
}
export function useFilter(
  data: Data[],
  compareFunc: (a: any, b: any, id: string) => number,
  wait = 500
): [
  Data[],
  (data: Data[], filter: Record<string, Filter>, order: Orders[]) => void
] {
  const [state, setState] = useState(data);
  const _debounce = useDebounce(
    (data: Data[], filter: Record<string, Filter>, order: Orders[]) => {
      console.log("start filter");
      const FilterResult = data
        .filter((v) => {
          const firstNotMatchColumn = Object.keys(filter).findIndex((fid) => {
            const f = filter[fid];
            if (typeof f.filter == "string") {
              switch (f.filter) {
                case "include":
                  return !includeFilter(f.data, v[fid]);
                case "equal":
                  return !equalFilter(f.data, v[fid]);
                case "between":
                  return !betweenFilter(f.data[0], f.data[1], v[fid]);
                case "fuzzyText":
                  return !fuzzyTextFilter(f.data, v[fid]);
                default:
                  console.warn(`unknwon filter ${fid}`);
                  return true;
              }
            } else if (!f.filter) {
              return fuzzyTextFilter(f.data, v[fid]);
            } else {
              return !f.filter(v[fid]);
            }
          });
          return firstNotMatchColumn == -1;
        })
        .sort((a, b) => {
          for (let i = 0; i < order.length; i++) {
            if (a[order[i].id] != b[order[i].id]) {
              switch (order[i].order) {
                case "asc":
                  return compareFunc(
                    a[order[i].id],
                    b[order[i].id],
                    order[i].id
                  );
                case "desc":
                  return -compareFunc(
                    a[order[i].id],
                    b[order[i].id],
                    order[i].id
                  );
                default:
                  return 0;
              }
            }
          }
          return compareFunc(a._name, b._name, "fallback");
        });
      setState(FilterResult);
    },
    wait
  );
  const setDebouncedState = (
    data: Data[],
    filter: Record<string, Filter>,
    order: Orders[]
  ) => {
    console.log("setDebouncedState");
    _debounce(data, filter, order);
  };

  return [state, setDebouncedState];
}
