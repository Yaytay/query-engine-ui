#!/bin/sh


npx openapi-typescript ${VITE_API_URL:-http://localhost:8000/}openapi.json -o src/Query-Engine-Schema.d.ts
