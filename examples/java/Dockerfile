FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
RUN addgroup -S -g 10001 marona \
    && adduser -S -D -H -u 10001 -G marona marona
COPY --chown=marona:marona examples/java/target/marona-a2a-java-example.jar ./app.jar
USER 10001:10001
EXPOSE 8100
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

