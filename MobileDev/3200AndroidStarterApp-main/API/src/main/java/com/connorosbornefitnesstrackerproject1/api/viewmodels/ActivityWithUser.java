package com.connorosbornefitnesstrackerproject1.api.viewmodels;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

public abstract class ActivityWithUser extends AppCompatActivity {
    protected UserViewModel viewModel;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewModel = new ViewModelProvider(this).get(UserViewModel.class);
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