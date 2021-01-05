
package com.example.boxinator;



import com.google.api.client.json.Json;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.gson.JsonObject;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;



@SpringBootApplication
public class BoxinatorApplication {

    @Value("${firebase_path}")
    private String firebasePath;

    @Value("${FIREBASE_CONFIG}")
    private String firebaseConfig;



    public static void main(String[] args) {
        SpringApplication.run(BoxinatorApplication.class, args);
    }

    @Bean
    public void firebaseAuth()  {


        try {
            JSONObject jsonObject = new JSONObject(firebaseConfig);
            String str = jsonObject.toString();
            InputStream serviceAccount = new ByteArrayInputStream(str.getBytes());



            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);

        }

        catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}

