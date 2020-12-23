package com.example.boxinator.Utils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.ResourceUtils;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.file.Files;

@Configuration
public class FirebaseConfig {

    @Value("${firebase_path}")
    private String firebasePath;

    @PostConstruct
    public void init() {

        File file = null;
        try {
            file = ResourceUtils.getFile("classpath:service-account-file.json");
            String content = new String(Files.readAllBytes(file.toPath()));
            System.out.println(content);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

//Read File Content


        System.out.println(firebasePath);
        /**
         * the .json file MUST be stored more securely.
         */
        InputStream serviceAccount =
                null;
        try {
            Resource resource = new ClassPathResource("classpath:service-account-file.json");
            serviceAccount = resource.getInputStream();
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);

        }

        catch (FileNotFoundException e) {
            e.printStackTrace();
            System.out.println("FILE NOT FOUnd" + firebasePath);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
