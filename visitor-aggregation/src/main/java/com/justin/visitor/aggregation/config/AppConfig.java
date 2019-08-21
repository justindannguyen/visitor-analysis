/**
 * Copyright (C) 2019, Justin Nguyen
 */
package com.justin.visitor.aggregation.config;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author tuan3.nguyen@gmail.com
 */
@Configuration
public class AppConfig {

  @Bean(name = "dateFormat")
  public DateFormat getDateFormat() {
    return new SimpleDateFormat("yyyy-MM-dd");
  }

  @Bean
  public ObjectMapper getObjectMapper() {
    return new ObjectMapper();
  }
}
