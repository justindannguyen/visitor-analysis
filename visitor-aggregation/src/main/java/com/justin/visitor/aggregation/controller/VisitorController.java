/**
 * Copyright (C) 2019, Justin Nguyen
 */
package com.justin.visitor.aggregation.controller;

import static com.justin.visitor.aggregation.VisitorAggregationProcessor.STORE_NAME;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.stream.binder.kafka.streams.InteractiveQueryService;
import org.springframework.http.HttpStatus;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.MessageChannel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author tuan3.nguyen@gmail.com
 */
@RestController
@RequestMapping("/api/v1/visitors")
public class VisitorController {
  @Autowired(required = false)
  private InteractiveQueryService queryService;

  @Autowired(required = false)
  private MessageChannel kafkaOutput;

  @Autowired
  @Qualifier("dateFormat")
  private DateFormat dateFormat;

  @GetMapping("countToday")
  @ResponseBody
  public Integer countToday() {
    final Map<String, Integer> todayValues = getValuesToday();
    return todayValues == null ? 0 : todayValues.keySet().size();
  }

  @PostMapping("/{id}")
  @ResponseStatus(code = HttpStatus.OK)
  public void detectFace(@PathVariable final String id, @RequestBody final String faceData) {
    kafkaOutput.send(
        MessageBuilder.withPayload(faceData)
                      .setHeader(KafkaHeaders.MESSAGE_KEY, id.getBytes())
                      .build());
  }

  @GetMapping("namesToday")
  @ResponseBody
  public Collection<String> getNamesToday() {
    final Map<String, Integer> todayValues = getValuesToday();
    return todayValues == null ? new ArrayList<>() : todayValues.keySet();
  }

  private Map<String, Integer> getValues(final Date date) {
    final ReadOnlyKeyValueStore<String, Map<String, Integer>> store =
        queryService.getQueryableStore(STORE_NAME, QueryableStoreTypes.keyValueStore());
    final String todayKey = dateFormat.format(date);
    return store.get(todayKey);
  }

  private Map<String, Integer> getValuesToday() {
    return getValues(new Date());
  }
}
