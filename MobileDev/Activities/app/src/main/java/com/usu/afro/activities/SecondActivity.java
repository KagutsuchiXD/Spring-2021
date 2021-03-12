package com.usu.afro.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class SecondActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        String name = intent.getStringExtra("usersName");
        setContentView(R.layout.activity_second);
        Button button = findViewById(R.id.save);
        TextView textView = findViewById(R.id.textView);
        textView.setText("Hello, " + name + ", Welcome to the second activity");
    }
}
