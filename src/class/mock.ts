let n = 0;
let tracker = {};
let maxN = 0;
// let C = 150
let C = 200 / (Math.log(10000) + 1);
// if (Number.isNaN(C) || C < 150) C = 150

const G = {
  nodes: [],
  partitionMatrix: {},
  partitionGraphic: {},
  partitionButtons: {},
  nodeSyncState: {},
  currentCycleCounter: 0,
  VW: 800,
  VH: 800,
  R: 15,
  X: 800,
  Y: 800,
  nodeRadius: 200,
  maxId: parseInt("ffff", 16),
}; // semi-global namespace

const generateHash = function (num) {
  const table = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];
  let hash = "";
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * table.length);
    hash += table[randomIndex];
  }
  return hash;
};

function generateNodeForTesting(count) {
  let nodes = [];
  for (let i = 0; i < count; i++) {
    const nodeId = generateHash(64);
    const data = {
      nodeId,
      // position: calculateNetworkPosition(parseInt(nodeId.substr(0, 4), 16), count),
      appState: generateHash(64),
      nodelistHash: generateHash(64),
      cycleMarker: generateHash(64),
      cycleCounter: Math.random(),
      txInjected: 0,
      txApplied: 0,
      txRejected: Math.random(),
      txExpired: Math.random(),
      desiredNodes: Math.random(),
      reportInterval: 2,
      nodeIpInfo: {
        externalIp: "127.0.0.1",
        externalPort: 3000,
      },
    };
    nodes.push(data);
  }
  return nodes;
}

function calculateNetworkPosition(
  nodeId: number,
  totalNodeCount: number,
  width: number,
  height: number
) {
  console.log("nodeId", nodeId);
  console.log("G.maxId", G.maxId);
  console.log("totalNodeCount", totalNodeCount);
  G.X = width / 2;
  G.Y = height / 2;
  // let spread = 12
  let spread = 5;
  let angle = 137.508;

  let phi = (angle * Math.PI) / 180;
  let idRatio = (nodeId / G.maxId) * totalNodeCount;
  if (tracker[idRatio]) {
    idRatio = maxN + 1;
  }
  tracker[idRatio] = true;
  if (idRatio > maxN) maxN = idRatio;
  n = idRatio;
  let r = spread * Math.sqrt(n) + C;
  const theta = n * phi;
  console.log("r, theta", r, theta);
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);
  n += 1;
  return {
    x,
    y,
    degree: angle * n,
  };
}

module.exports = {
  generateNodeForTesting,
  calculateNetworkPosition,
};
