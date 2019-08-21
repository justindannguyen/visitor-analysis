package com.justin.visitor.aggregation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import com.justin.visitor.aggregation.config.MqttConfig;

@SpringBootApplication
@EnableDiscoveryClient
@EnableConfigurationProperties(value = {MqttConfig.class})
public class VisitorAggregationApplication {

  public static void main(final String[] args) {
    SpringApplication.run(VisitorAggregationApplication.class, args);
  }
}

