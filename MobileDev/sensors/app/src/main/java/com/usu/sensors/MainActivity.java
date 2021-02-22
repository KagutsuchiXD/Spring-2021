    package com.usu.sensors;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private TextView mTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final TextView xAccel = findViewById(R.id.xAccel);

        final TextView yAccel = findViewById(R.id.yAccel);

        final TextView zAccel = findViewById(R.id.zAccel);

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

                        xAccel.setText("x: " + gx);
                        yAccel.setText("y: " + gy);
                        zAccel.setText("z: " + gz);
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