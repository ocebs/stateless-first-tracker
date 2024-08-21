FROM denoland/deno:alpine
USER deno

WORKDIR /app
COPY . .
RUN deno cache mod.ts util/populateMapList.ts util/scanFirsts.ts

CMD [ "run","-A", "mod.ts"]
