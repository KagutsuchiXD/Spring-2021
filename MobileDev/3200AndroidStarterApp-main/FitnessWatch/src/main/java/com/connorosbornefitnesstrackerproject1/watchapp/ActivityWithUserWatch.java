package com.connorosbornefitnesstrackerproject1.watchapp;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import android.content.Intent;
import android.os.Bundle;

import com.connorosbornefitnesstrackerproject1.api.viewmodels.GoalListViewModel;
import com.connorosbornefitnesstrackerproject1.api.viewmodels.UserViewModel;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;


public abstract class ActivityWithUserWatch extends AppCompatActivity {
    protected UserViewModel viewModel;
    protected GoalListViewModel goalView;
    public DatabaseReference database;
    public FirebaseAuth auth;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewModel = new ViewModelProvider(this).get(UserViewModel.class);
        goalView = new ViewModelProvider(this).get(GoalListViewModel.class);
        this.database = FirebaseDatabase.getInstance().getReference();
        this.auth = FirebaseAuth.getInstance();
    }

    @Override
    protected void onStart() {
        super.onStart();
        viewModel.getUser().observe(this, (user) -> {
            if (user == null){
                Intent intent = new Intent(this, SignInSignUpWatch.class);
                startActivity(intent);
                finish();
            }

        });
    }
}