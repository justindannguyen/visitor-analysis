/**
 * Copyright (C) 2019, Justin Nguyen
 */
package com.justin.visitor.aggregation.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.common.utils.Bytes;
import org.apache.kafka.streams.kstream.Aggregator;
import org.apache.kafka.streams.kstream.Initializer;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.KeyValueStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.context.annotation.Profile;
import org.springframework.messaging.handler.annotation.SendTo;

import com.justin.visitor.aggregation.MqttService;
import com.justin.visitor.aggregation.VisitorAggregationProcessor;
import com.justin.visitor.aggregation.VisitorCountSerDer;

/**
 * @author tuan3.nguyen@gmail.com
 */
@EnableBinding(VisitorAggregationProcessor.class)
@Profile("!test")
public class StreamConfig {

  private static final class Aggretor implements Aggregator<String, String, Map<String, Integer>> {
    @Override
    public Map<String, Integer> apply(final String key, final String value,
        final Map<String, Integer> values) {
      Integer count = values.get(value);
      if (count == null) {
        count = 0;
      }
      values.put(value, ++count);
      return values;
    }
  }

  private static final class Initor implements Initializer<Map<String, Integer>> {
    @Override
    public Map<String, Integer> apply() {
      return new HashMap<>();
    }
  }

  @Autowired
  private MqttService mqttService;

  @StreamListener(VisitorAggregationProcessor.INPUT)
  @SendTo(VisitorAggregationProcessor.OUTPUT)
  public KStream<String, Map<String, Integer>> process(
      final KStream<String, String> detectionStream) {
    final Materialized<String, Map<String, Integer>, KeyValueStore<Bytes, byte[]>> materializes =
        Materialized.as(VisitorAggregationProcessor.STORE_NAME);
    materializes.withValueSerde(new VisitorCountSerDer());
    return detectionStream.groupByKey()
                          .aggregate(new Initor(), new Aggretor(), materializes)
                          .toStream();
  }

  @StreamListener(VisitorAggregationProcessor.MQTT_SINK_INPUT)
  public void sinkToMqtt(final String visitor) {
    if (visitor != null && !visitor.isEmpty()) {
      mqttService.publishVisitorEntry(visitor);
    }
  }
}
