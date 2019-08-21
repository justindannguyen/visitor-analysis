FROM openjdk:8-jre
LABEL maintainer Justin Nguyen <tuan3.nguyen@gmail.com>

ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENTRYPOINT ["/usr/bin/java", "-jar", "/usr/share/visitor-aggregation.jar"]

ARG JAR_FILE
ADD target/${JAR_FILE} /usr/share/visitor-aggregation.jar