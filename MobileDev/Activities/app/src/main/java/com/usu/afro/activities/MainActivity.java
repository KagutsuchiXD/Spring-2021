package com.usu.afro.activities;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {
    public static final int NEW_NOTE = 10;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d("ON CREATE", "was called");
        setContentView(R.layout.activity_main);
        Button button = findViewById(R.id.button);
        EditText myEditText = findViewById(R.id.name);
        button.setOnClickListener((view) ->{
            Intent intent = new Intent(this, SecondActivity.class);
            String name = myEditText.getText().toString();
            intent.putExtra("usersName", name);
            intent.putExtra("usersAge", 28);
            startActivityForResult(intent, NEW_NOTE);
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d("ON RESUME", "was called");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}