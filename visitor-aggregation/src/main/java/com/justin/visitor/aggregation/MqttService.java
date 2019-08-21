/**
 * Copyright (C) 2019, Justin Nguyen
 */
package com.justin.visitor.aggregation;

import javax.annotation.PostConstruct;

import org.eclipse.paho.client.mqttv3.IMqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.justin.visitor.aggregation.config.MqttConfig;

import lombok.extern.slf4j.Slf4j;

/**
 * @author tuan3.nguyen@gmail.com
 */
@Service
@Slf4j
public class MqttService {
  public static enum QOS {
    AT_MOST_ONE, AT_LEAST_ONE, EXACTLY_ONE;
  }

  @Autowired
  private MqttConfig mqttConfig;
  @Autowired
  private ObjectMapper objectMapper;

  private IMqttAsyncClient mqttClient;
  private MqttConnectOptions mqttConnectOpts;

  public void publish(final String topic, final QOS qos, final Object message) {
    try {
      byte[] body = message instanceof String ? ((String) message).getBytes()
          : objectMapper.writeValueAsBytes(message);
      mqttClient.publish(topic, body, qos.ordinal(), true);
    } catch (final JsonProcessingException | MqttException ex) {
      log.error("Can't publish MQTT message to " + topic, ex);
    }
  }

  public void publishVisitorEntry(final String dto) {
    log.info("Publish visitor entry {}", dto);
    publish(mqttConfig.getVisitorEntryTopic(), QOS.AT_LEAST_ONE, dto);
  }

  @PostConstruct
  private void init() throws MqttException {
    this.mqttConnectOpts = new MqttConnectOptions();
    this.mqttConnectOpts.setAutomaticReconnect(true);
    this.mqttConnectOpts.setCleanSession(false);
    final String password = mqttConfig.getPassword();
    if (password != null && !password.isEmpty()) {
      this.mqttConnectOpts.setPassword(password.toCharArray());
    }
    final String username = mqttConfig.getUsername();
    if (username != null && !username.isEmpty()) {
      this.mqttConnectOpts.setUserName(username);
    }

    this.mqttClient =
        new MqttAsyncClient(mqttConfig.getBrokerUrl(), System.currentTimeMillis() + "");
    this.mqttClient.connect(mqttConnectOpts);
  }
}
