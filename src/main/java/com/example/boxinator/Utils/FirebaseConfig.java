package com.example.boxinator.Utils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.ResourceUtils;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.stream.Collectors;

@Configuration
public class FirebaseConfig {



    @Value("${firebase_path}")
    private String firebasePath;

    @PostConstruct
    public void init() {

        System.out.println(firebasePath);

        try (InputStream inputStream = getClass().getResourceAsStream("./service-account-file.json");
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String contents = reader.lines()
                    .collect(Collectors.joining(System.lineSeparator()));
            System.out.println(contents);
        } catch(Exception e){

        }

        try (InputStream inputStream = getClass().getResourceAsStream("/service-account-file.json");
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String contents = reader.lines()
                    .collect(Collectors.joining(System.lineSeparator()));
            System.out.println(contents);
        } catch(Exception e){

        }


        /**
         * the .json file MUST be stored more securely.
         */
        InputStream serviceAccount =
                null;
        try {

           serviceAccount =  this.getClass().getResourceAsStream("./service-account-file.json");
            System.out.println("after 40");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            System.out.println("after 45");

            FirebaseApp.initializeApp(options);

            System.out.println("after 48");


        }

        catch (FileNotFoundException e) {
            e.printStackTrace();
            System.out.println("FILE NOT FOUnd" + firebasePath);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}