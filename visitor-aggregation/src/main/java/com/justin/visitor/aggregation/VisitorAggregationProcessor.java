/**
 * Copyright (C) 2019, Justin Nguyen
 */
package com.justin.visitor.aggregation;

import org.apache.kafka.streams.kstream.KStream;
import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.SubscribableChannel;

/**
 * @author tuan3.nguyen@gmail.com
 */
public interface VisitorAggregationProcessor {
  String STORE_NAME = "dayAggregation";

  String INPUT = "dayAggregationInput";
  String OUTPUT = "dayAggregationOutput";
  String MQTT_SINK_INPUT = "mqttSinkInput";

  @Input(INPUT)
  KStream<?, ?> dayAggregationInput();

  @Output(OUTPUT)
  KStream<?, ?> dayAggregationOutput();

  @Input(MQTT_SINK_INPUT)
  SubscribableChannel mqttSinkInput();
}
