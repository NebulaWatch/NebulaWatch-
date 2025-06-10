#!/bin/bash
echo "Deploying NebulaWatch..."
docker-compose down
docker-compose build
docker-compose up -d
echo "Deployment complete."
