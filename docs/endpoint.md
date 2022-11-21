# `GET` Endpoints
These `GET` endpoint are primarily for monitor client to be able to visualize data.

## GET /api/report
This endpoint provide a summarized latest data of the network. The endpoint is being called by monitor client by every set interval. One url parameter is specified as such `/api/report?timestamp=234009234098`. If timestamp is specified, only the node data newer than specified timestamp is returned.
The interval at which client make request can as often as 2s upto the interval of heartbeat being sent by consenor to monitor system.  This is done by reading the configuration of a consensor.
This example included data from a network of 9 consensor.
```
GET /api/report
{
	"nodes": {
		"joining": {},
		"syncing": {},
		"active": {
			"ec39bc4b833317d068714a08f70b63bc4870bb7d65572b0907b1111b01b35a89": {
				"repairsStarted": 2,
				"repairsFinished": 2,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9002,
					"internalIp": "127.0.0.1",
					"internalPort": 10002
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "ec39bc4b833317d068714a08f70b63bc4870bb7d65572b0907b1111b01b35a89",
				"timestamp": 1668952621423,
				"crashed": false
			},
			"11a7ddd6725a53053e5e23f7734d3d0726e96ed272d3d44e31bc1574a4b4d476": {
				"repairsStarted": 0,
				"repairsFinished": 0,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9006,
					"internalIp": "127.0.0.1",
					"internalPort": 10006
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "11a7ddd6725a53053e5e23f7734d3d0726e96ed272d3d44e31bc1574a4b4d476",
				"timestamp": 1668952620615,
				"crashed": false
			},
			"eb5c820688ff00c62a2938c2605e71064d77bc607d8dc5b63a590b891c3e6e0e": {
				"repairsStarted": 1,
				"repairsFinished": 1,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9005,
					"internalIp": "127.0.0.1",
					"internalPort": 10005
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "eb5c820688ff00c62a2938c2605e71064d77bc607d8dc5b63a590b891c3e6e0e",
				"timestamp": 1668952620612,
				"crashed": false
			},
			"be6f7b64f5899a1e3ac5eff1cc5aafbef2d8c09fb64e3585b084825cbd6a23f4": {
				"repairsStarted": 0,
				"repairsFinished": 0,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9001,
					"internalIp": "127.0.0.1",
					"internalPort": 10001
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "be6f7b64f5899a1e3ac5eff1cc5aafbef2d8c09fb64e3585b084825cbd6a23f4",
				"timestamp": 1668952620614,
				"crashed": false
			},
			"caa67b8f78ed5aa6a4c5d3f5adc1a575b897f2505ac5fbd79538792713fcc161": {
				"repairsStarted": 0,
				"repairsFinished": 0,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9008,
					"internalIp": "127.0.0.1",
					"internalPort": 10008
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "caa67b8f78ed5aa6a4c5d3f5adc1a575b897f2505ac5fbd79538792713fcc161",
				"timestamp": 1668952620616,
				"crashed": false
			},
			"80f4590f62ea744c9120f01cafb678982655464e220fc5e977d3738839267bbe": {
				"repairsStarted": 0,
				"repairsFinished": 0,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9007,
					"internalIp": "127.0.0.1",
					"internalPort": 10007
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "80f4590f62ea744c9120f01cafb678982655464e220fc5e977d3738839267bbe",
				"timestamp": 1668952620602,
				"crashed": false
			},
			"f0aba4375a39382c08ccda316b616e14f1098246436dc1d6acae5784e0f6c368": {
				"repairsStarted": 1,
				"repairsFinished": 1,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9009,
					"internalIp": "127.0.0.1",
					"internalPort": 10009
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "f0aba4375a39382c08ccda316b616e14f1098246436dc1d6acae5784e0f6c368",
				"timestamp": 1668952620617,
				"crashed": false
			},
			"83c96c976bbf6d86fb4fa3d6c431a17588463771a3ac4db78aeb74b0e026522c": {
				"repairsStarted": 0,
				"repairsFinished": 0,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9004,
					"internalIp": "127.0.0.1",
					"internalPort": 10004
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "83c96c976bbf6d86fb4fa3d6c431a17588463771a3ac4db78aeb74b0e026522c",
				"timestamp": 1668952620607,
				"crashed": false
			},
			"6034f812d496369a604669d9535e4edcab45b8045d1ea3d53a14e46781b648c6": {
				"repairsStarted": 1,
				"repairsFinished": 1,
				"isDataSynced": true,
				"appState": "00ff00ff",
				"cycleMarker": "cde53008c6e69ce4a8bdbe1347ac670ce239531251a041c10209af8654c37147",
				"cycleCounter": 9,
				"nodelistHash": "7352a88df2a0c882e39c94bb318cdc842b8f67de01a1b6756f40cb91b913c98e",
				"desiredNodes": 250,
				"lastScalingTypeWinner": null,
				"lastScalingTypeRequested": null,
				"txInjected": 0,
				"txApplied": 0,
				"txRejected": 0,
				"txExpired": 0,
				"txProcessed": 0,
				"reportInterval": 2000,
				"nodeIpInfo": {
					"externalIp": "127.0.0.1",
					"externalPort": 9003,
					"internalIp": "127.0.0.1",
					"internalPort": 10003
				},
				"partitionReport": {},
				"globalSync": true,
				"partitions": 9,
				"partitionsCovered": 9,
				"currentLoad": {
					"networkLoad": 0,
					"nodeLoad": {
						"internal": 0,
						"external": 0
					}
				},
				"queueLength": 0,
				"executeQueueLength": 0,
				"txTimeInQueue": 0,
				"isRefuted": false,
				"shardusVersion": "2.7.0",
				"nodeId": "6034f812d496369a604669d9535e4edcab45b8045d1ea3d53a14e46781b648c6",
				"timestamp": 1668952620618,
				"crashed": false
			}
		}
	},
	"totalInjected": 575,
	"totalRejected": 0,
	"totalExpired": 0,
	"totalProcessed": 564,
	"avgTps": 0,
	"maxTps": 10,
	"rejectedTps": 0,
	"timestamp": 1668952622295
}

```
## GET /api/sync-report
This endpoint emits data related to node sync history for monitor client to draw sync graph. This endpint is being called intervally only for the sync report graph page by monitor client. This mean as lone as sync report page is opened in the browser, it'll keep calling `/api/sync-report` and `/api/report` intervally.

Example:

```
GET /api/sync-report
{
	"ec39bc4b833317d068714a08f70b63bc4870bb7d65572b0907b1111b01b35a89": {
		"cycleStarted": 0,
		"cycleEnded": 0,
		"numCycles": 1,
		"syncComplete": true,
		"numNodesOnStart": 0,
		"p2pJoinTime": 59.259,
		"timeBeforeDataSync": 0.016,
		"timeBeforeDataSync2": 0.016,
		"totalSyncTime": 59.275,
		"syncStartTime": 1668952040028,
		"syncEndTime": 1668952040028,
		"syncSeconds": 0,
		"syncRanges": 0,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 0,
		"numGlobalAccounts": 0,
		"internalFlag": false
	},
	"f0aba4375a39382c08ccda316b616e14f1098246436dc1d6acae5784e0f6c368": {
		"cycleStarted": 4,
		"cycleEnded": 4,
		"numCycles": 0,
		"syncComplete": true,
		"numNodesOnStart": 1,
		"p2pJoinTime": 0.039,
		"timeBeforeDataSync": 0.005,
		"timeBeforeDataSync2": 6.017,
		"totalSyncTime": 6.521,
		"syncStartTime": 1668952331580,
		"syncEndTime": 1668952332047,
		"syncSeconds": 0.467,
		"syncRanges": 1,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 15,
		"numGlobalAccounts": 1,
		"internalFlag": true
	},
	"caa67b8f78ed5aa6a4c5d3f5adc1a575b897f2505ac5fbd79538792713fcc161": {
		"cycleStarted": 4,
		"cycleEnded": 4,
		"numCycles": 0,
		"syncComplete": true,
		"numNodesOnStart": 1,
		"p2pJoinTime": 0.043,
		"timeBeforeDataSync": 0.006,
		"timeBeforeDataSync2": 6.018,
		"totalSyncTime": 6.542,
		"syncStartTime": 1668952331581,
		"syncEndTime": 1668952332063,
		"syncSeconds": 0.482,
		"syncRanges": 1,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 15,
		"numGlobalAccounts": 1,
		"internalFlag": true
	},
	"83c96c976bbf6d86fb4fa3d6c431a17588463771a3ac4db78aeb74b0e026522c": {
		"cycleStarted": 4,
		"cycleEnded": 4,
		"numCycles": 0,
		"syncComplete": true,
		"numNodesOnStart": 1,
		"p2pJoinTime": 0.036,
		"timeBeforeDataSync": 0.007,
		"timeBeforeDataSync2": 6.019,
		"totalSyncTime": 6.55,
		"syncStartTime": 1668952331580,
		"syncEndTime": 1668952332077,
		"syncSeconds": 0.497,
		"syncRanges": 1,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 15,
		"numGlobalAccounts": 1,
		"internalFlag": true
	},
	"eb5c820688ff00c62a2938c2605e71064d77bc607d8dc5b63a590b891c3e6e0e": {
		"cycleStarted": 4,
		"cycleEnded": 4,
		"numCycles": 0,
		"syncComplete": true,
		"numNodesOnStart": 1,
		"p2pJoinTime": 0.041,
		"timeBeforeDataSync": 0.008,
		"timeBeforeDataSync2": 6.023,
		"totalSyncTime": 6.559,
		"syncStartTime": 1668952331579,
		"syncEndTime": 1668952332078,
		"syncSeconds": 0.499,
		"syncRanges": 1,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 15,
		"numGlobalAccounts": 1,
		"internalFlag": true
	},
	"11a7ddd6725a53053e5e23f7734d3d0726e96ed272d3d44e31bc1574a4b4d476": {
		"cycleStarted": 4,
		"cycleEnded": 4,
		"numCycles": 0,
		"syncComplete": true,
		"numNodesOnStart": 1,
		"p2pJoinTime": 0.041,
		"timeBeforeDataSync": 0.008,
		"timeBeforeDataSync2": 6.027,
		"totalSyncTime": 6.56,
		"syncStartTime": 1668952331588,
		"syncEndTime": 1668952332081,
		"syncSeconds": 0.493,
		"syncRanges": 1,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 15,
		"numGlobalAccounts": 1,
		"internalFlag": true
	},
	"be6f7b64f5899a1e3ac5eff1cc5aafbef2d8c09fb64e3585b084825cbd6a23f4": {
		"cycleStarted": 4,
		"cycleEnded": 4,
		"numCycles": 0,
		"syncComplete": true,
		"numNodesOnStart": 1,
		"p2pJoinTime": 0.039,
		"timeBeforeDataSync": 0.005,
		"timeBeforeDataSync2": 6.023,
		"totalSyncTime": 6.557,
		"syncStartTime": 1668952331588,
		"syncEndTime": 1668952332084,
		"syncSeconds": 0.496,
		"syncRanges": 1,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 15,
		"numGlobalAccounts": 1,
		"internalFlag": true
	},
	"80f4590f62ea744c9120f01cafb678982655464e220fc5e977d3738839267bbe": {
		"cycleStarted": 4,
		"cycleEnded": 4,
		"numCycles": 0,
		"syncComplete": true,
		"numNodesOnStart": 1,
		"p2pJoinTime": 0.036,
		"timeBeforeDataSync": 0.008,
		"timeBeforeDataSync2": 6.027,
		"totalSyncTime": 6.56,
		"syncStartTime": 1668952331588,
		"syncEndTime": 1668952332086,
		"syncSeconds": 0.498,
		"syncRanges": 1,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 15,
		"numGlobalAccounts": 1,
		"internalFlag": true
	},
	"6034f812d496369a604669d9535e4edcab45b8045d1ea3d53a14e46781b648c6": {
		"cycleStarted": 4,
		"cycleEnded": 4,
		"numCycles": 0,
		"syncComplete": true,
		"numNodesOnStart": 1,
		"p2pJoinTime": 0.036,
		"timeBeforeDataSync": 0.007,
		"timeBeforeDataSync2": 6.03,
		"totalSyncTime": 6.56,
		"syncStartTime": 1668952331592,
		"syncEndTime": 1668952332087,
		"syncSeconds": 0.495,
		"syncRanges": 1,
		"failedAccountLoops": 0,
		"failedAccounts": 0,
		"failAndRestart": 0,
		"discardedTXs": 0,
		"nonDiscardedTXs": 0,
		"numSyncedState": 0,
		"numAccounts": 15,
		"numGlobalAccounts": 1,
		"internalFlag": true
	}
}
```
## GET /api/scale-report
This endpint includes data related to network scaling timeline, monitor client primarily used to draw graph
of network scale timeline.
```
GET /api/scale-report
[
	{
		"nodeId": "6fa683e624b8699790e8a4e443a4b9fd0bb974870ac555c4b3d974d27cad41fe",
		"ip": "127.0.0.1",
		"port": 9004,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "up"
	},
	{
		"nodeId": "9e60539aba1d4767966b29680cb3ea421dcd01886508afc395c0aee6619eb85e",
		"ip": "127.0.0.1",
		"port": 9007,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "up"
	},
	{
		"nodeId": "e9c2620c661519dc398e1ec8dd3212e6ad7fc475716dba28f897d16d6aff56a1",
		"ip": "127.0.0.1",
		"port": 9006,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "up"
	},
	{
		"nodeId": "cdf05ab2f4c5aca50b87d37927db5dc85fae68b75d4bd2f5e958e508c8aee256",
		"ip": "127.0.0.1",
		"port": 9001,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "up"
	},
	{
		"nodeId": "d7def6257ee4a43176b761e02f77a5cddc6606fb00278cde54a43e3819714fdc",
		"ip": "127.0.0.1",
		"port": 9009,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "up"
	},
	{
		"nodeId": "e086a88deba1e34ebcfd5eff06032dcb881e9572652c4d09715412e04029f227",
		"ip": "127.0.0.1",
		"port": 9008,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "up"
	},
	{
		"nodeId": "37ba2e0d938565f8665fbc6bcf34c9faed14647b7cf71441fb3083d49e462e78",
		"ip": "127.0.0.1",
		"port": 9003,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "up"
	},
	{
		"nodeId": "c6b4974a987fa73e42af67f06ac9781d6155a4be8f852ee3d8acd78e04b7c917",
		"ip": "127.0.0.1",
		"port": 9002,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "up"
	},
	{
		"nodeId": "3b768fde82fdf53f5912adc25c15d4ecce01ab4fd74b370f224d13375d5ac106",
		"ip": "127.0.0.1",
		"port": 9005,
		"lastScalingTypeWinner": null,
		"lastScalingTypeRequested": "down"
	}
]
```

## GET /api/removed
This endpoint provide data of node that has been removed from an active list, this is called by the primary network visualization page intervally.
```
{
	"removed": [
		{
			"ip": "127.0.0.1",
			"port": 9005,
			"nodeId": "3b768fde82fdf53f5912adc25c15d4ecce01ab4fd74b370f224d13375d5ac106",
			"counter": 66
		}
	]
}
```
## GET /api/history
This endpoint provide the latest timestamp of a node's last heartbeat, joined, active status. This is called by the history page intervally.
```
{
	"9046aafaf49b798452805c5db4dd7d2ef545b38d8ab8015b45225b136cd17fe9": {
		"joined": 1669031762932,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9002,
				"internalIp": "127.0.0.1",
				"internalPort": 10002
			},
			"nodeId": "9046aafaf49b798452805c5db4dd7d2ef545b38d8ab8015b45225b136cd17fe9"
		},
		"active": 1669031942015,
		"heartbeat": 1669032240666,
		"removed": 1669032242005
	},
	"e9c2620c661519dc398e1ec8dd3212e6ad7fc475716dba28f897d16d6aff56a1": {
		"joined": 1669032107516,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9006,
				"internalIp": "127.0.0.1",
				"internalPort": 10006
			},
			"nodeId": "e9c2620c661519dc398e1ec8dd3212e6ad7fc475716dba28f897d16d6aff56a1"
		},
		"active": 1669032182010,
		"heartbeat": 1669034580412,
		"removed": 1669034582008
	},
	"9e60539aba1d4767966b29680cb3ea421dcd01886508afc395c0aee6619eb85e": {
		"joined": 1669032107518,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9007,
				"internalIp": "127.0.0.1",
				"internalPort": 10007
			},
			"nodeId": "9e60539aba1d4767966b29680cb3ea421dcd01886508afc395c0aee6619eb85e"
		},
		"active": 1669032182006,
		"heartbeat": 1669034580530,
		"removed": 1669034582017
	},
	"4f7b843ac84d063328b6071635566b664f0870622e75f2c99b6df4a3e480b44b": {
		"joined": 1669032107519,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9005,
				"internalIp": "127.0.0.1",
				"internalPort": 10005
			},
			"nodeId": "4f7b843ac84d063328b6071635566b664f0870622e75f2c99b6df4a3e480b44b"
		},
		"active": 1669032182009,
		"heartbeat": 1669032480852,
		"removed": 1669032482004
	},
	"cdf05ab2f4c5aca50b87d37927db5dc85fae68b75d4bd2f5e958e508c8aee256": {
		"joined": 1669032107523,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9001,
				"internalIp": "127.0.0.1",
				"internalPort": 10001
			},
			"nodeId": "cdf05ab2f4c5aca50b87d37927db5dc85fae68b75d4bd2f5e958e508c8aee256"
		},
		"active": 1669032182011,
		"heartbeat": 1669034580410,
		"removed": 1669034582009
	},
	"6fa683e624b8699790e8a4e443a4b9fd0bb974870ac555c4b3d974d27cad41fe": {
		"joined": 1669032107527,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9004,
				"internalIp": "127.0.0.1",
				"internalPort": 10004
			},
			"nodeId": "6fa683e624b8699790e8a4e443a4b9fd0bb974870ac555c4b3d974d27cad41fe"
		},
		"active": 1669032182008,
		"heartbeat": 1669033081708,
		"removed": 1669033082004
	},
	"d7def6257ee4a43176b761e02f77a5cddc6606fb00278cde54a43e3819714fdc": {
		"joined": 1669032347527,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9009,
				"internalIp": "127.0.0.1",
				"internalPort": 10009
			},
			"nodeId": "d7def6257ee4a43176b761e02f77a5cddc6606fb00278cde54a43e3819714fdc"
		},
		"active": 1669032422029,
		"heartbeat": 1669034581732,
		"removed": 1669034582011
	},
	"e086a88deba1e34ebcfd5eff06032dcb881e9572652c4d09715412e04029f227": {
		"joined": 1669032587505,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9008,
				"internalIp": "127.0.0.1",
				"internalPort": 10008
			},
			"nodeId": "e086a88deba1e34ebcfd5eff06032dcb881e9572652c4d09715412e04029f227"
		},
		"active": 1669032662006,
		"heartbeat": 1669034940537,
		"removed": 1669034942013
	},
	"37ba2e0d938565f8665fbc6bcf34c9faed14647b7cf71441fb3083d49e462e78": {
		"joined": 1669032707506,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9003,
				"internalIp": "127.0.0.1",
				"internalPort": 10003
			},
			"nodeId": "37ba2e0d938565f8665fbc6bcf34c9faed14647b7cf71441fb3083d49e462e78"
		},
		"active": 1669032782002,
		"heartbeat": 1669035241322,
		"removed": 1669035242012
	},
	"c6b4974a987fa73e42af67f06ac9781d6155a4be8f852ee3d8acd78e04b7c917": {
		"joined": 1669032887531,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9002,
				"internalIp": "127.0.0.1",
				"internalPort": 10002
			},
			"nodeId": "c6b4974a987fa73e42af67f06ac9781d6155a4be8f852ee3d8acd78e04b7c917"
		},
		"active": 1669032962004,
		"heartbeat": 1669035541945,
		"removed": 1669035542013
	},
	"3b768fde82fdf53f5912adc25c15d4ecce01ab4fd74b370f224d13375d5ac106": {
		"joined": 1669032947504,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9005,
				"internalIp": "127.0.0.1",
				"internalPort": 10005
			},
			"nodeId": "3b768fde82fdf53f5912adc25c15d4ecce01ab4fd74b370f224d13375d5ac106"
		},
		"active": 1669033022004,
		"heartbeat": 1669035840174,
		"removed": 1669035842009
	},
	"77f53860ebc295dbcb9c217f3393dd5f765d53ab5de278d2daab9305a9b34f5a": {
		"joined": 1669033247505,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9004,
				"internalIp": "127.0.0.1",
				"internalPort": 10004
			},
			"nodeId": "77f53860ebc295dbcb9c217f3393dd5f765d53ab5de278d2daab9305a9b34f5a"
		},
		"active": 1669033382008,
		"heartbeat": 1669036140769,
		"removed": 1669036142011
	},
	"e52033bd0747ba8516c10eaf122b5ed09e657efedd43c76e7c30ad6ae5410d3b": {
		"joined": 1669034747531,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9001,
				"internalIp": "127.0.0.1",
				"internalPort": 10001
			},
			"nodeId": "e52033bd0747ba8516c10eaf122b5ed09e657efedd43c76e7c30ad6ae5410d3b"
		},
		"active": 1669034882019,
		"heartbeat": 1669036223639
	},
	"4e9aa97bb85d487a1018e1e245fc373b648840154ef02065e747cd3c97b43a31": {
		"joined": 1669035047520,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9009,
				"internalIp": "127.0.0.1",
				"internalPort": 10009
			},
			"nodeId": "4e9aa97bb85d487a1018e1e245fc373b648840154ef02065e747cd3c97b43a31"
		},
		"active": 1669035182016,
		"heartbeat": 1669036222859
	},
	"794269ce03a0375c4c468851e34f1343e484d9b3d1ec1265685df0a3057a86db": {
		"joined": 1669035347526,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9008,
				"internalIp": "127.0.0.1",
				"internalPort": 10008
			},
			"nodeId": "794269ce03a0375c4c468851e34f1343e484d9b3d1ec1265685df0a3057a86db"
		},
		"active": 1669035482015,
		"heartbeat": 1669036221896
	},
	"2c036431294c6a75106a5e87b6b91a4c185c12a4a892aa7a9e483d2f1ee907f9": {
		"joined": 1669035647517,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9006,
				"internalIp": "127.0.0.1",
				"internalPort": 10006
			},
			"nodeId": "2c036431294c6a75106a5e87b6b91a4c185c12a4a892aa7a9e483d2f1ee907f9"
		},
		"active": 1669035782015,
		"heartbeat": 1669036223101
	},
	"281ea3892c4fbb4894310e4df71cb1efe71a9bef060971275d0361ae83a4211c": {
		"joined": 1669035947526,
		"data": {
			"nodeIpInfo": {
				"externalIp": "127.0.0.1",
				"externalPort": 9003,
				"internalIp": "127.0.0.1",
				"internalPort": 10003
			},
			"nodeId": "281ea3892c4fbb4894310e4df71cb1efe71a9bef060971275d0361ae83a4211c"
		},
		"active": 1669036082028,
		"heartbeat": 1669036222421
	}
}

```
