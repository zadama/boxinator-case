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
import java.nio.file.Files;

@Configuration
public class FirebaseConfig {

    @Autowired
    ResourceLoader resourceLoader;

    @Value("${firebase_path}")
    private String firebasePath;

    @PostConstruct
    public void init() {

        try{
            ClassLoader classLoader = this.getClass().getClassLoader();
            // Getting resource(File) from class loader
            File configFile=new File(classLoader.getResource("service-account-file.json").getFile());
            System.out.println(configFile.getAbsoluteFile() + " - " + configFile.getAbsolutePath());
            FileInputStream fileInputStream = new FileInputStream(configFile);
            System.out.println("FIRST DONE!!!!!!!!");
        } catch(Exception e){

        }


        System.out.println(firebasePath);
        /**
         * the .json file MUST be stored more securely.
         */
        InputStream serviceAccount =
                null;
        try {


            serviceAccount =  Thread.currentThread().getContextClassLoader().getResourceAsStream("service-account-file.json");

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