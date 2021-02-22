package com.example.watchapp;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.api.Verify;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Verify.verifyWatchApp();
    }
}