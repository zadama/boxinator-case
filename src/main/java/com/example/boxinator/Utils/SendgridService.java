package com.example.boxinator.Utils;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Repositories.AccountRepository;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

@Service
public class SendgridService {

    @Autowired
    private AccountRepository accountRepository;

    SendGrid sendGrid;

    @Value("${app.mode}")
    private String enviromentMode;

    @Autowired
    public SendgridService(SendGrid sendGrid) {
        this.sendGrid = sendGrid;
    }


    public void sendReceipt (String recipient,String receiver,String desCountry,String boxColor,Long weight){
        Account account = accountRepository.findByEmail(recipient).orElse(null);
        // replaces whitespace with %20 which is identical in browser URL.
        receiver = receiver.replaceAll("\\s+","%20");
        boxColor = boxColor.replaceAll("\\s+","%20");
        desCountry = desCountry.replaceAll("\\s+","%20");

        String queryParams = "receiver=" + receiver + "&des_country="+ desCountry + "&box_color=" + boxColor + "&weight=" + weight + "&id="+ account.getId() + "&email=" + recipient;
        System.out.println(queryParams);
        String verificationLink = enviromentMode.equals("dev") ? "http://localhost:3000/register?" + queryParams : "https://boxinator-application.herokuapp.com/register?" + queryParams;
        Email from = new Email("paria.karim@se.experis.com"); // Should be changed to our "company" email
        Email to = new Email(recipient);

        String subject = "Sending with Twilio SendGrid is Fun";
        Content content = new Content("text/html", "Register account to calim the shipment <a href="+ verificationLink+ "> Register account </a>");


        Mail mail = new Mail(from, subject, to, content);



        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = this.sendGrid.api(request);
            System.out.println(("Status code: "+ response.getStatusCode() + " Body: "
                    + response.getBody() + " Headers: " + response.getHeaders()));

        } catch (Exception ex) {
            System.out.println("Error sending mail: " + ex.getMessage());

        }
    }
}
