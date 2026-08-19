# Multi-stage Dockerfile to build and run the Spring Boot backend
# Builds backend located in backend/ and produces a runnable JAR

# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /work

# Copy backend build inputs
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

# Run maven package (skip tests to speed build)
RUN mvn -f backend/pom.xml -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /work/backend/target/sunnyside-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080

ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.port=$PORT -Dspring.datasource.url='jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE' -Dspring.datasource.username=sa -Dspring.datasource.password= -jar /app/app.jar"]
