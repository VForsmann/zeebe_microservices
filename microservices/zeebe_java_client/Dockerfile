#
# Build stage
#
FROM maven:3.6.3-openjdk-16 AS build

# Use docker-cache!
COPY ./pom.xml /home/app/pom.xml
RUN mvn -f /home/app/pom.xml dependency:go-offline -B

COPY src /home/app/src
RUN mvn -f /home/app/pom.xml clean package -T100

EXPOSE 8080
ENTRYPOINT ["java","-jar","/home/app/target/zeebe-get-started-java-client-0.1.0-jar-with-dependencies.jar"]