# monitor-server

Monitor server for the Shardus Enterprise server.

# Health Check

GET `/is-alive` this endpoint returns 200 if the server is running.
GET `/is-healthy` currently the same as `/is-alive` but will be expanded.

## Releasing

To release, just run `npm run release`.
