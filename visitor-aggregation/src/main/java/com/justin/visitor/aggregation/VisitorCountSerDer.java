/**
 * Copyright (C) 2019, Justin Nguyen
 */
package com.justin.visitor.aggregation;

import java.util.Map;

import org.springframework.kafka.support.serializer.JsonSerde;

/**
 * @author tuan3.nguyen@gmail.com
 */
public class VisitorCountSerDer extends JsonSerde<Map<String, Integer>> {
}
