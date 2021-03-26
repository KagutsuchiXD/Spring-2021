package com.connorosbornefitnesstrackerproject1.phoneapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.EditText;

import com.connorosbornefitnesstrackerproject1.api.models.Goal;

public class SetGoals extends ActivityWithUser {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_goals);

        findViewById(R.id.set_goals).setOnClickListener((view) -> {
            EditText numSteps = findViewById(R.id.number_of_steps);
            EditText minutesExercise = findViewById(R.id.minutes_of_exercise);
            System.out.println("Steps: " + numSteps.getText().toString());
            System.out.println("Exercise: " + minutesExercise.getText().toString());
            int stepGoal;
            int exGoal;
            try{
                stepGoal = Integer.parseInt(numSteps.getText().toString());
                exGoal = Integer.parseInt(minutesExercise.getText().toString());
            }
            catch (NumberFormatException e){
                stepGoal = 0;
                exGoal = 0;
            }

            Goal steps = new Goal("Steps", stepGoal);

            Goal exercise = new Goal("Exercise", exGoal);

            viewModel.storeUserGoalData(steps);
            viewModel.storeUserGoalData(exercise);

            Intent homeIntent = new Intent(this, HomeActivity.class);
            startActivity(homeIntent);
            finish();
        });

        findViewById(R.id.logout).setOnClickListener((view) -> {
            viewModel.signOut();
        });
    }
}