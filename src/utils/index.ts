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

export function isIPv6(ip: string) {
  const slicedArr = ip.split(':');
  if (slicedArr.length !== 8) return false;

  //TODO potentially replace regex with something faster (needs testing)
  for (const str of slicedArr) {
    // Check if string is a valid regex
    const hexRegex = /^[0-9A-Fa-f]+$/;
    if (str.length < 0 || str.length > 4) return false;
    if (str.match(hexRegex) == null) return false;
  }

  return true;
}

/**
 * check if ip is bogon.
 * call getIpArr can throw an error if the format is wrong
 * @param ip
 * @returns
 */
export function isBogonIP(ip) {
  let ipArr;
  try {
    ipArr = getIpArr(ip);
  } catch (e) {
    console.log(ip, e);
    return true;
  }
  return isPrivateIP(ipArr) || isReservedIP(ipArr);
}

/**
 * check if ip is invalid for lan use.
 * call getIpArr can throw an error if the format is wrong
 * @param ip
 * @returns
 */
export function isInvalidIP(ip) {
  let ipArr;
  try {
    ipArr = getIpArr(ip);
  } catch (e) {
    console.log(ip, e);
    return true;
  }
  return isReservedIP(ipArr);
}

function getIpArr(ip: string) {
  const slicedArr = ip.split('.');
  if (slicedArr.length !== 4) {
    throw new Error('Invalid IP address provided');
  }

  for (const number of slicedArr) {
    const num = Number(number);
    if (num.toString() !== number) {
      throw new Error('Leading zero detected. Invalid IP address');
    }
    if (num < 0 || num > 255) {
      throw new Error('Invalid IP address provided');
    }
  }
  // Change to numbers Array
  const numArray = [
    Number(slicedArr[0]),
    Number(slicedArr[1]),
    Number(slicedArr[2]),
    Number(slicedArr[3]),
  ];
  return numArray;
}

function isPrivateIP(ip) {
  return (
    // 10.0.0.0/8  Private-use networks
    ip[0] === 10 ||
    // 100.64.0.0/10 Carrier-grade NAT
    (ip[0] === 100 && ip[1] >= 64 && ip[1] <= 127) ||
    // 127.0.0.0/8 Loopback + Name collision occurrence (127.0.53.53)
    ip[0] === 127 ||
    // 169.254.0.0/16  Link local
    (ip[0] === 169 && ip[1] === 254) ||
    // 172.16.0.0/12 Private-use networks
    (ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31) ||
    // 192.168.0.0/16  Private-use networks
    (ip[0] === 192 && ip[1] === 168)
  );
}

function isReservedIP(ip) {
  return (
    // 0.0.0.0/8 "This" network
    ip[0] === 0 ||
    // 192.0.0.0/24  IETF protocol assignments
    (ip[0] === 192 && ip[1] === 0 && ip[2] === 0) ||
    // 192.0.2.0/24  TEST-NET-1
    (ip[0] === 192 && ip[1] === 0 && ip[2] === 2) ||
    // 198.18.0.0/15 Network interconnect device benchmark testing
    (ip[0] === 198 && ip[1] >= 18 && ip[1] <= 19) ||
    // 198.51.100.0/24 TEST-NET-2
    (ip[0] === 198 && ip[1] === 51 && ip[2] === 100) ||
    // 203.0.113.0/24  TEST-NET-3
    (ip[0] === 203 && ip[1] === 0 && ip[2] === 113) ||
    // 224.0.0.0/4 Multicast
    (ip[0] >= 224 && ip[0] <= 239) ||
    // 240.0.0.0/4 Reserved for future use
    ip[0] >= 240 ||
    // 255.255.255.255/32
    (ip[0] === 255 && ip[1] === 255 && ip[2] === 255 && ip[3] === 255)
  );
}

export function mapToObjectRecursive(
  map: Map<string, any> | {[key: string]: any}
): {[key: string]: any} {
  const obj: {[key: string]: any} = {};
  if (map instanceof Map) {
    for (const [key, value] of map.entries()) {
      if (value instanceof Map || typeof value === 'object') {
        obj[key] = mapToObjectRecursive(value);
      } else {
        obj[key] = value;
      }
    }
  } else if (Array.isArray(map)) {
    return map;
  } else {
    for (const [key, value] of Object.entries(map)) {
      if (value instanceof Map || typeof value === 'object') {
        obj[key] = mapToObjectRecursive(value);
      } else {
        obj[key] = value;
      }
    }
  }
  return obj;
}

// A class used for tracking cycleMarkers being reported by nodes
export class MarkerCount {
  private nodeMap: Map<string, string>;
  private markerCount: Map<string, number>;
  private heap: [string, number][];
  private possibleNewMarker: string;

  constructor() {
    this.nodeMap = new Map();
    this.markerCount = new Map();
    this.heap = [];
    this.possibleNewMarker = null;
  }

  note(nodeId: string, marker: string) {
    if(!this.nodeMap.has(nodeId)) {
      this.nodeMap.set(nodeId, marker);
      this.increment(marker);
    } else {
      const oldMarker = this.nodeMap.get(nodeId);
      if (oldMarker !== marker) {
        this.updateNodeMarker(oldMarker, marker);
        this.nodeMap.set(nodeId, marker);
      }
    }
  }

  increment(marker: string) {
    this.markerCount.set(marker, (this.markerCount.get(marker) || 0) + 1);
    this.heapify();
  }

  updateNodeMarker(oldMarker: string, newMarker: string) {
    if (oldMarker === this.heap[0][0]) {
      this.possibleNewMarker = newMarker;
    }
    this.markerCount.set(oldMarker, this.markerCount.get(oldMarker) - 1);
    if (this.markerCount.get(oldMarker) === 0) {
      this.markerCount.delete(oldMarker);
    }
    this.increment(newMarker);
  }

  verifyMarker(marker: string): boolean {
    if (marker === this.heap[0][0]) {
      return true;
    }
    if (marker === this.possibleNewMarker) {
      return true;
    }
    return false;
  }

  getCorrectMarker(): string {
    return this.heap[0][0];
  }

  heapify() {
    this.heap = Array.from(this.markerCount.entries());
    this.heap.sort((a, b) => b[1] - a[1]);
  }
}
