package com.connorosbornefitnesstrackerproject1.watchapp;

import androidx.annotation.NonNull;
import androidx.databinding.ObservableList;
import androidx.lifecycle.MutableLiveData;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.connorosbornefitnesstrackerproject1.api.models.Goal;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class HomeActivity extends ActivityWithUserWatch {
    long lastStepTimeStamp = System.currentTimeMillis();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_watch_home);
        viewModel.getUser().observe(this, (user) -> {
            if (user != null){
                SensorManager accelManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
                SensorManager heartManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
                Sensor accelerometer = accelManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
                Sensor heartrate = heartManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);

                accelManager.registerListener(
                        new SensorEventListener() {
                            @Override
                            public void onSensorChanged(SensorEvent event) {
                                float x = event.values[0];
                                float y = event.values[1];
                                float z = event.values[2];

                                float gx = x / SensorManager.GRAVITY_EARTH;
                                float gy = y / SensorManager.GRAVITY_EARTH;
                                float gz = z / SensorManager.GRAVITY_EARTH;

                                float normg = (float)Math.sqrt(gx*gx + gy*gy + gz*gz);

                                if (normg > 1.5){
                                    long now = System.currentTimeMillis();
                                    if (lastStepTimeStamp + 500 < now){
                                        long stepCount = goalView.getStepCount().getValue() + (long)1;
                                        database.child("userData").child(auth.getCurrentUser().getUid()).child("goalList").child("StepGoal").child("progress").setValue(stepCount);
                                        lastStepTimeStamp = now;
                                    }
                                }
                            }

                            @Override
                            public void onAccuracyChanged(Sensor sensor, int accuracy) {
                            }
                        },
                        accelerometer,
                        SensorManager.SENSOR_DELAY_NORMAL
                );

                heartManager.registerListener(
                        new SensorEventListener() {
                            @Override
                            public void onSensorChanged(SensorEvent event) {
                                float rate = event.values[0];



                                if (rate > 150){
                                    long now = System.currentTimeMillis();
                                    if (lastStepTimeStamp + 500 < now){
                                        Long heartratetime = goalView.getHeartrateTime().getValue() + ((now - lastStepTimeStamp)/1000);
                                        database.child("userData").child(auth.getCurrentUser().getUid()).child("goalList").child("ExerciseGoal").child("progress").setValue(heartratetime);
                                        lastStepTimeStamp = now;
                                    }
                                }
                            }

                            @Override
                            public void onAccuracyChanged(Sensor sensor, int accuracy) {
                            }
                        },
                        heartrate,
                        SensorManager.SENSOR_DELAY_NORMAL
                );
            }
        });

        LinearLayout goals = findViewById(R.id.goal_list);
//        goalView.getGoalList().addOnListChangedCallback(new ObservableList.OnListChangedCallback() {
//            @Override
//            public void onChanged(ObservableList sender) {
//            }
//
//            @Override
//            public void onItemRangeChanged(ObservableList sender, int positionStart, int itemCount) {
//                Goal goal = goalView.getGoalList().get(positionStart);
//                View thisGoalItem = goals.getChildAt(positionStart);
//            }
//
//            @Override
//            public void onItemRangeInserted(ObservableList sender, int positionStart, int itemCount) {
//                Goal goal = goalView.getGoalList().get(positionStart);
//                View goalListItem = LayoutInflater.from(HomeActivity.this).inflate(R.layout.goal_list_item, null);
//                TextView goalInfo = goalListItem.findViewById(R.id.goal);
//                String info = "Goal for " + goal.task + ": " + goal.amount;
//                goalInfo.setText(info);
//                TextView progressInfo = goalListItem.findViewById(R.id.progress);
//                progressInfo.setText("Progress: " + goal.progress);
//
//                goals.addView(goalListItem);
//            }
//
//            @Override
//            public void onItemRangeMoved(ObservableList sender, int fromPosition, int toPosition, int itemCount) {
//
//            }
//
//            @Override
//            public void onItemRangeRemoved(ObservableList sender, int positionStart, int itemCount) {
//
//            }
//        });

        findViewById(R.id.logout).setOnClickListener((view) -> {
            viewModel.signOut();
        });
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