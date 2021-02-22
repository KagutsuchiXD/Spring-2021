package com.usu.stepcounter;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatTextView;
import androidx.wear.widget.BoxInsetLayout;

import java.lang.*;

public class MainActivity extends AppCompatActivity {


    int stepCount = 0;
    long lastStepTimeStamp = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final TextView numberText = findViewById(R.id.number_text);
        BoxInsetLayout mainFace = findViewById(R.id.outer);

        mainFace.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                stepCount = 0;
                numberText.setText(""+stepCount);
                return true;
            }
        });

        SensorManager sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        Sensor accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        sensorManager.registerListener(
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
                                stepCount += 1;
                                numberText.setText(""+stepCount);
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
    }
}