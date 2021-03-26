package com.connorosbornefitnesstrackerproject1.phoneapp;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableList;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.connorosbornefitnesstrackerproject1.api.models.Goal;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class HomeActivity extends ActivityWithUser {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        LinearLayout goals = findViewById(R.id.goal_list);
        viewModel.getUser().observe(this, (user) -> {
            if (user != null){
                database.child("userData").child(auth.getCurrentUser().getUid()).child("goalList").addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        if(!snapshot.exists()){
                            Intent goalIntent = new Intent(HomeActivity.this, SetGoals.class);
                            startActivity(goalIntent);
                            finish();
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {

                    }
                });
            }
        });


        goalView.getGoalList().addOnListChangedCallback(new ObservableList.OnListChangedCallback() {
            @Override
            public void onChanged(ObservableList sender) {
            }

            @Override
            public void onItemRangeChanged(ObservableList sender, int positionStart, int itemCount) {
                Goal goal = goalView.getGoalList().get(positionStart);
                View thisGoalItem = goals.getChildAt(positionStart);
                TextView goalInfo = thisGoalItem.findViewById(R.id.goal);
                String info = "Goal for " + goal.task + ": " + goal.amount;
                goalInfo.setText(info);
                goalInfo.setText(info);
                TextView progressInfo = thisGoalItem.findViewById(R.id.progress);
                progressInfo.setText("Progress: " + goal.progress);
            }

            @Override
            public void onItemRangeInserted(ObservableList sender, int positionStart, int itemCount) {
                Goal goal = goalView.getGoalList().get(positionStart);
                View goalListItem = LayoutInflater.from(HomeActivity.this).inflate(R.layout.goal_list_item, null);
                TextView goalInfo = goalListItem.findViewById(R.id.goal);
                String info = "Goal for " + goal.task + ": " + goal.amount;
                goalInfo.setText(info);
                TextView progressInfo = goalListItem.findViewById(R.id.progress);
                progressInfo.setText("Progress: " + goal.progress);

                goals.addView(goalListItem);
            }

            @Override
            public void onItemRangeMoved(ObservableList sender, int fromPosition, int toPosition, int itemCount) {

            }

            @Override
            public void onItemRangeRemoved(ObservableList sender, int positionStart, int itemCount) {

            }
        });

        findViewById(R.id.logout_button).setOnClickListener((view) -> {
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

        database.child("userData").child(auth.getCurrentUser().getUid()).child("goalList").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if(!snapshot.exists()){
                    Intent goalIntent = new Intent(HomeActivity.this, SetGoals.class);
                    startActivity(goalIntent);
                    finish();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

}