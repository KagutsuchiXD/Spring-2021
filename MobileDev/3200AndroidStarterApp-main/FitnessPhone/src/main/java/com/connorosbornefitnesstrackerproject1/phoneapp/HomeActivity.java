package com.connorosbornefitnesstrackerproject1.phoneapp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import com.connorosbornefitnesstrackerproject1.api.viewmodels.UserViewModel;

public class HomeActivity extends AppCompatActivity {
    UserViewModel viewModel;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        viewModel = new ViewModelProvider(this).get(UserViewModel.class);

        Button logout = findViewById(R.id.logout_button);

        logout.setOnClickListener((view) -> {
            viewModel.signOut();
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        viewModel.getUser().observe(this, (user) -> {
            if (user == null){
                Intent intent = new Intent(this, SignInSignUp.class);
                startActivity(intent);
                finish();
            }
        });
    }
}