package com.connorosbornefitnesstrackerproject1.api.viewmodels;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.ObservableArrayList;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.connorosbornefitnesstrackerproject1.api.models.User;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.connorosbornefitnesstrackerproject1.api.models.Goal;

import java.util.List;

public class GoalListViewModel extends UserViewModel {
    ObservableArrayList<Goal> goalList;
    private MutableLiveData<Long> heartrateTime;
    private MutableLiveData<Long> stepCount;

    public GoalListViewModel(){}

    public ObservableArrayList<Goal> getGoalList(){
        if (goalList == null){
            goalList = new ObservableArrayList<Goal>();
            loadGoalList();
        }
        return goalList;
    }

    public MutableLiveData<Long> getStepCount() {
        if(stepCount == null){
            stepCount = new MutableLiveData<Long>();
            stepCount.setValue((long)0);
            initStepCount();
        }
        return stepCount;
    }

    public void incrementSteps(){
        database.child("userData").child(auth.getCurrentUser().getUid()).child("goalList").child("StepGoal").child("progress").setValue(stepCount.getValue() + 1);
    }

    private void initStepCount(){
        database.child("userData").child(auth.getCurrentUser().getUid()).child("goalList").child("StepGoal").child("progress").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                stepCount.setValue((long)snapshot.getValue());
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

    public MutableLiveData<Long> getHeartrateTime() {
        if(heartrateTime == null){
            heartrateTime = new MutableLiveData<Long>();
            heartrateTime.setValue((long)0);
            initHeartrateTime();
        }
        return heartrateTime;
    }

    private void initHeartrateTime(){
        database.child("userData").child(auth.getCurrentUser().getUid()).child("goalList").child("ExerciseGoal").child("progress").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                heartrateTime.setValue((Long)snapshot.getValue());
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

    private void loadGoalList(){
        database.child("userData").child(auth.getCurrentUser().getUid()).child("goalList").addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {
                Goal task = snapshot.getValue(Goal.class);
                task.id = snapshot.getKey();
                goalList.add(task);
                System.out.println("Gol List size: " + getGoalList().size());
                Log.d("ADDED", "A contact was added");
            }

            @Override
            public void onChildChanged(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {
                Goal task = snapshot.getValue(Goal.class);
                task.id = snapshot.getKey();
                int index = goalList.indexOf(task);
                goalList.set(index, task);
                Log.d("Index", "" + index);
                Log.d("CHANGED", "A contact was changed");
            }

            @Override
            public void onChildRemoved(@NonNull DataSnapshot snapshot) {
                Log.d("REMOVED", "A contact was removed");
            }

            @Override
            public void onChildMoved(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {

            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }


    public void updateGoal(String id, Boolean check){
        database.child("/goalList").child(id).child("checked").setValue(check);
    }

}
