package com.connorosbornefitnesstrackerproject1.phoneapp;

import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.widget.EditText;

import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;

import com.connorosbornefitnesstrackerproject1.api.models.Goal;

import java.util.ArrayList;
import java.util.Locale;

public class SetGoals extends ActivityWithUser {
    public static final int RECORD_CODE = 1;
    private boolean isTalking = false;
    TextToSpeech textToSpeech;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_goals);
        requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, RECORD_CODE);

        textToSpeech = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int i) {
                textToSpeech.setLanguage(Locale.getDefault());
            }
        });

        SpeechRecognizer recognizer1 = SpeechRecognizer.createSpeechRecognizer(this);
        recognizer1.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle bundle) {

            }

            @Override
            public void onBeginningOfSpeech() {

            }

            @Override
            public void onRmsChanged(float v) {

            }

            @Override
            public void onBufferReceived(byte[] bytes) {

            }

            @Override
            public void onEndOfSpeech() {

            }

            @Override
            public void onError(int i) {
                System.out.println("Error: " + i);
            }

            @Override
            public void onResults(Bundle bundle) {
                ArrayList<String> results = bundle.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                String stepGoal = results.get(0);
                EditText numSteps = findViewById(R.id.number_of_steps);
                numSteps.setText(stepGoal);
                textToSpeech.speak(stepGoal, TextToSpeech.QUEUE_FLUSH, null, "goal");
            }

            @Override
            public void onPartialResults(Bundle bundle) {

            }

            @Override
            public void onEvent(int i, Bundle bundle) {

            }
        });
        SpeechRecognizer recognizer2 = SpeechRecognizer.createSpeechRecognizer(this);
        recognizer2.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle bundle) {

            }

            @Override
            public void onBeginningOfSpeech() {

            }

            @Override
            public void onRmsChanged(float v) {

            }

            @Override
            public void onBufferReceived(byte[] bytes) {

            }

            @Override
            public void onEndOfSpeech() {

            }

            @Override
            public void onError(int i) {
                System.out.println("Error: " + i);
            }

            @Override
            public void onResults(Bundle bundle) {
                ArrayList<String> results = bundle.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                String exGoal = results.get(0);
                EditText minutesExercise = findViewById(R.id.minutes_of_exercise);
                minutesExercise.setText(exGoal);
                textToSpeech.speak(exGoal, TextToSpeech.QUEUE_FLUSH, null, "goal");
            }

            @Override
            public void onPartialResults(Bundle bundle) {

            }

            @Override
            public void onEvent(int i, Bundle bundle) {

            }
        });
        Intent recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);

        findViewById(R.id.talk1).setOnClickListener((view) -> {
            if(!isTalking) {
                recognizer1.startListening(recognizerIntent);
                isTalking = true;
            } else {
                isTalking = false;
                recognizer1.stopListening();
            }
        });

        findViewById(R.id.talk2).setOnClickListener((view) -> {
            if(!isTalking) {
                recognizer2.startListening(recognizerIntent);
                isTalking = true;
            } else {
                isTalking = false;
                recognizer2.stopListening();
            }
        });

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