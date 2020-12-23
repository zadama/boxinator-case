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
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;


@Configuration
public class FirebaseConfig {


    @Value("${firebase_path}")
    private String firebasePath;

    private void getAllFiles(File curDir){
        System.out.println(curDir.getName());
    }

    @PostConstruct
    public void init() {

        getAllFiles(new File("./src/main/resources/service-account-file.json"));



        /**
         * the .json file MUST be stored more securely.
         */
        InputStream serviceAccount =
                null;
        try {

            serviceAccount = this.getClass().getResourceAsStream( "/service-account-file.json");
            if(serviceAccount == null){
                System.out.println("first was null");

                serviceAccount = this.getClass().getResourceAsStream( "./service-account-file.json");
            }
            if(serviceAccount == null){
                System.out.println("second was null was null");

                serviceAccount = this.getClass().getResourceAsStream( "./src/main/resources/service-account-file.json");
            }

        
            System.out.println("after 40");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            System.out.println("after 45");

            FirebaseApp.initializeApp(options);

            System.out.println("after 48");


        } catch (FileNotFoundException e) {
            e.printStackTrace();
            System.out.println("FILE NOT FOUnd" + firebasePath);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}