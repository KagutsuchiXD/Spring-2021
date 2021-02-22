package com.usu.basicevents;

import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.R;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;
import androidx.appcompat.widget.AppCompatTextView;

public class MainActivity extends AppCompatActivity {

    private TextView mTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //The Old Way
/*        LinearLayout linearLayout = new LinearLayout(this);

        AppCompatTextView textView = new AppCompatTextView(this);
        textView.setText("Hello, this is my first view!");
        textView.setTextSize(18);

        linearLayout.addView(textView);

        AppCompatButton button = new AppCompatButton(this);
        button.setText("Press Me!");
        linearLayout.addView(button);

        setContentView(linearLayout);*/

        setContentView(R.layout.activity_main);
    }
}