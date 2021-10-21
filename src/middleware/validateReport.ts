function isExist(value: any) {
  if (value === null || value === undefined || typeof value === "undefined")
    return false;
  return true;
}

/**
 * User Defined Type Guard!
 */
function validateReport(arg) {
  if (!arg) {
    console.log(`No arg`);
    return false;
  }
  // console.log(arg)
  if (!isExist(arg.repairsStarted) || typeof arg.repairsStarted !== "number") {
    console.log(`No repairsStarted`);
    return false;
  }
  if (
    !isExist(arg.repairsFinished) ||
    typeof arg.repairsFinished !== "number"
  ) {
    console.log(`No repairsFinished`);
    return false;
  }
  if (!isExist(arg.cycleMarker) || typeof arg.cycleMarker !== "string") {
    console.log(`No cycleMarker`);
    return false;
  }
  if (!isExist(arg.cycleCounter) || typeof arg.cycleCounter !== "number") {
    console.log(`No cycleCounter`);
    return false;
  }
  if (!isExist(arg.nodelistHash) || typeof arg.nodelistHash !== "string") {
    console.log(`No nodelistHash`);
    return false;
  }
  if (!isExist(arg.desiredNodes) || typeof arg.desiredNodes !== "number") {
    console.log(`No desiredNodes`);
    return false;
  }
  if (!isExist(arg.txInjected) || typeof arg.txInjected !== "number") {
    console.log(`No txInjected`);
    return false;
  }
  if (!isExist(arg.txApplied) || typeof arg.txApplied !== "number") {
    console.log(`No txApplied`);
    return false;
  }
  if (!isExist(arg.txRejected) || typeof arg.txRejected !== "number") {
    console.log(`No txRejected`);
    return false;
  }
  if (!isExist(arg.txExpired) || typeof arg.txExpired !== "number") {
    console.log(`No txExpired`);
    return false;
  }
  if (!isExist(arg.txProcessed) || typeof arg.txProcessed !== "number") {
    console.log(`No txProcessed`);
    return false;
  }
  if (!isExist(arg.nodeIpInfo) && typeof arg.nodeIpInfo === "object") {
    if (
      !arg.nodeIpInfo.externalIp ||
      typeof arg.nodeIpInfo.externalIp !== "string"
    ) {
      console.log(`No externalIp`);
      return false;
    }
    if (
      !arg.nodeIpInfo.externalPort ||
      typeof arg.nodeIpInfo.externalPort !== "number"
    ) {
      console.log(`No externalPort`);
      return false;
    }
    if (
      !arg.nodeIpInfo.internalIp ||
      typeof arg.nodeIpInfo.internalIp !== "string"
    ) {
      console.log(`No internalIp`);
      return false;
    }
    if (
      !arg.nodeIpInfo.internalPort ||
      typeof arg.nodeIpInfo.internalPort !== "number"
    ) {
      console.log(`No internalPort`);
      return false;
    }
  }
  if (!isExist(arg.globalSync) || typeof arg.globalSync !== "boolean") {
    console.log(`No globalSync`);
    return false;
  }
  if (!isExist(arg.partitions) || typeof arg.partitions !== "number") {
    console.log(`No partitions`);
    return false;
  }
  if (
    !isExist(arg.partitionsCovered) ||
    typeof arg.partitionsCovered !== "number"
  ) {
    console.log(`No partitionsCovered`);
    return false;
  }
  if (!isExist(arg.currentLoad)) {
    console.log(`No currentLoad`);
    return false;
  }
  if (!isExist(arg.queueLength) || typeof arg.queueLength !== "number") {
    console.log(`No queueLength`);
    return false;
  }
  if (!isExist(arg.txTimeInQueue) || typeof arg.txTimeInQueue !== "number") {
    console.log(`No txTimeInQueue`);
    return false;
  }
  return true;
}
module.exports = validateReport;
