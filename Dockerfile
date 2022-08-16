FROM denoland/deno:alpine
USER deno

EXPOSE 8080

WORKDIR /app
COPY . .
RUN deno cache mod.ts
ENV TINI_SUBREAPER=

CMD [ "run","-A", "mod.ts"]
