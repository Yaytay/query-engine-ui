#!/bin/sh

npx openapi-typescript http://localhost:8000/openapi.json -o src/Query-Engine-Schema.d.ts
