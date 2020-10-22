import { useCallback } from "react";
import { debounce } from "lodash";
export function useDebounce(
  func: (...args: any) => any,
  wait = 500
): (...args: any) => void {
  return useCallback(debounce(func, wait), []);
}
