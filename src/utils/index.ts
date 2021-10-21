type Comparator<T, E = T> = (a: E, b: T) => number;

export function insertSorted<T>(arr: T[], item: T, comparator?: Comparator<T>) {
  let i = binarySearch(arr, item, comparator);
  if (i < 0) {
    i = -1 - i;
  }
  arr.splice(i, 0, item);
}

/**
 * Binary search in JavaScript.
 * Returns the index of of the element in a sorted array or (-n-1) where n is the insertion point for the new element.
 *   If the return value is negative use 1-returned as the insertion point for the element
 * Parameters:
 *     arr - A sorted array
 *     el - An element to search for
 *     compare_fn - A comparator function. The function takes two arguments: (el, ae) and returns:
 *       a negative number  if el is less than ae;
 *       a positive number if el is greater than ae.
 *       0 if el is equal to ae;
 *       note that el is the element we are searching for and ae is an array element from the sorted array
 * The array may contain duplicate elements. If there are more than one equal elements in the array,
 * the returned value can be the index of any one of the equal elements.
 *
 * @param arr
 * @param el
 * @param comparator
 */
export function binarySearch<T, E = Partial<T>>(
  arr: T[],
  el: E,
  comparator?: Comparator<T, typeof el>
) {
  if (comparator == null) {
    // Emulate the default Array.sort() comparator
    comparator = (a, b) => {
      return a.toString() > b.toString()
        ? 1
        : a.toString() < b.toString()
        ? -1
        : 0;
    };
  }
  let m = 0;
  let n = arr.length - 1;
  while (m <= n) {
    const k = (n + m) >> 1;
    const cmp = comparator(el, arr[k]);
    if (cmp > 0) {
      m = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return -m - 1;
}

export const computeMedian = (arr = [], sort = true) => {
  if (sort) {
    arr.sort((a, b) => a - b);
  }
  const len = arr.length;
  switch (len) {
    case 0: {
      return 0;
    }
    case 1: {
      return arr[0];
    }
    default: {
      const mid = len / 2;
      if (len % 2 === 0) {
        return arr[mid];
      } else {
        return (arr[Math.floor(mid)] + arr[Math.ceil(mid)]) / 2;
      }
    }
  }
};
