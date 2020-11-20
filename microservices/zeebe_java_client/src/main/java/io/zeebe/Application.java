package io.zeebe;

import io.zeebe.client.ZeebeClient;
import io.zeebe.client.ZeebeClientBuilder;
import io.zeebe.client.api.response.ActivatedJob;
import io.zeebe.client.api.worker.JobClient;
import io.zeebe.client.api.worker.JobHandler;
import io.zeebe.client.api.worker.JobWorker;

import java.time.Duration;
import java.util.Map;
import java.util.HashMap;

public class Application {

  public static void main(String[] args) {
    final String contactPoint = "zeebe:26500";

    final String jobType = "check_payment";

    final ZeebeClientBuilder builder =
            ZeebeClient.newClientBuilder().gatewayAddress(contactPoint).usePlaintext();
    final ZeebeClient client = builder.build();
    try {

      System.out.println("Opening job worker.");
      final JobWorker workerRegistration =
              client
                      .newWorker()
                      .jobType(jobType)
                      .handler(new PaymentJobHandler())
                      .timeout(Duration.ofSeconds(10))
                      .open();
      try {
        System.out.println("Job worker opened and receiving jobs!");
        waitUntilClose();
      } catch (Exception e) {
        e.printStackTrace();
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

  }

  private static class PaymentJobHandler implements JobHandler {
    @Override
    public void handle(final JobClient client, final ActivatedJob job) {      
      final Map<String, Object> variables = job.getVariablesAsMap();
      int costPerMinute = (int) variables.get("costPerMinute");
      String bookedTime = (String) variables.get("bookedTime");
      int minutes = (Integer.parseInt(bookedTime.split(":")[0])) * 60 + (Integer.parseInt(bookedTime.split(":")[1]));
      Integer payedValue = (Integer) variables.get("payedValue");

      // Maybe something wrong here?
      // System.out.println(minutes * costPerMinute);
      // System.out.println(payedValue);

      if(minutes * costPerMinute != payedValue) {
        System.out.println("PAYED CORRECTLY");
        final Map<String, Object> result = new HashMap<>();
        result.put("paymentSuccess", true);
        client.newCompleteCommand(job.getKey()).variables(result).send().join();
      } else {
        final Map<String, Object> result = new HashMap<>();
        result.put("paymentSuccess", false);
        client.newCompleteCommand(job.getKey()).variables(result).send().join();
        System.out.println("PAYED INCORRECTLY");
      }
    }
  }

  // Dont change anything here!
  private static void waitUntilClose() {
        // Does look like black Magic, but it isnt. Keeps this App Running.
        // As a result the current thread, main for instance, waits on join() for thread main, that is itself, to end. Deadlocked.
        // No CPU-Usage, cause using JVM Features
        try {
          Thread.currentThread().join();
        } catch(Exception exception) {
          exception.printStackTrace();
        }
  }

}