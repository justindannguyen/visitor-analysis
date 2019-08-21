/**
 * Copyright (C) 2019, Justin Nguyen
 */
package com.justin.visitor.aggregation.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import lombok.Data;

/**
 * @author tuan3.nguyen@gmail.com
 */
@Data
public class VisitorEntryDto {
  private String name;
  @DateTimeFormat(iso = ISO.DATE_TIME)
  private Date time;
}
