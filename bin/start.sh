#!/usr/bin/env bash
export PORT=3100

pm2 kill

pm2 start ./process.json