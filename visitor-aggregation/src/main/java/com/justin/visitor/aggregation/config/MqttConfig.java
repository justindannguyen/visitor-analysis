/**
 * Copyright (C) 2019, Justin Nguyen
 */
package com.justin.visitor.aggregation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

/**
 * @author tuan3.nguyen@gmail.com
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "mqtt", ignoreUnknownFields = true)
public class MqttConfig {
  private String brokerUrl;
  private String username;
  private String password;
  private String visitorEntryTopic;
}
