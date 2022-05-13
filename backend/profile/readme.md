```yaml
version: "3.8"

services:
  profile:
    image: docker-registry.groupclaes.be/groupclaes_web-api_profile
    environment:
      NODE_ENV: production
      APP_VERSION: v1
    deploy:
      mode: replicated
      replicas: 2
      placement:
        constraints: [node.labels.worker == true]
      resources:
        reservations:
          memory: 20M
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.gro-sso.rule=Host(`liva.groupclaes.be`) && PathPrefix(`/v1/profile`)"
        - "traefik.http.routers.gro-sso.entrypoints=web"
        - "traefik.http.services.gro-sso.loadbalancer.server.port=80"
    healthcheck:
      test: wget -q --spider http://localhost/healthcheck || exit 1
      interval: 10s
      timeout: 5s
      start_period: 5s
      retries: 2
    configs:
      - source: groupclaes_web-api_profile
        target: /usr/src/app/config.js
    networks:
      - traefik_web
      - logging
      - default

networks:
  traefik_web:
    external: true
  logging:
    external: true

configs:
  groupclaes_web-api_profile:
    external: true
```