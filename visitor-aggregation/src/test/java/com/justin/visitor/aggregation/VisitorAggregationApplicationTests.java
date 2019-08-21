package com.justin.visitor.aggregation;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import com.justin.visitor.aggregation.VisitorAggregationApplication;

@ActiveProfiles(profiles = "test")
@RunWith(SpringRunner.class)
@SpringBootTest(classes = VisitorAggregationApplication.class)
public class VisitorAggregationApplicationTests {

  @Test
  public void contextLoads() {}

}

