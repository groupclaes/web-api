```yaml
version: "3.8"

services:
  v1_employees:
    image: docker-registry.groupclaes.be/groupclaes_web-api_employees
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
        - "traefik.http.routers.groweb-api-employees.rule=Host(`api.groupclaes.be`) && PathPrefix(`/v1/employees`)"
        - "traefik.http.routers.groweb-api-employees.entrypoints=web"
        - "traefik.http.services.groweb-api-employees.loadbalancer.server.port=80"
    healthcheck:
      test: wget -q --spider http://localhost/healthcheck || exit 1
      interval: 10s
      timeout: 5s
      start_period: 5s
      retries: 2
    configs:
      - source: groupclaes_web-api_employees
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
  groupclaes_web-api_employees:
    external: true
```