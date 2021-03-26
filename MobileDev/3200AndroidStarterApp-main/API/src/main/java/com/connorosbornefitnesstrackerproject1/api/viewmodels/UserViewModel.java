package com.connorosbornefitnesstrackerproject1.api.viewmodels;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.ObservableArrayList;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.connorosbornefitnesstrackerproject1.api.models.Goal;
import com.connorosbornefitnesstrackerproject1.api.models.User;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;


public class UserViewModel extends ViewModel {
    public DatabaseReference database;
    public FirebaseAuth auth;
    MutableLiveData<User> user = new MutableLiveData<>();
    MutableLiveData<RuntimeException> loginError = new MutableLiveData<>();

    public UserViewModel() {
        database = FirebaseDatabase.getInstance().getReference();
        this.auth = FirebaseAuth.getInstance();
        this.auth.addAuthStateListener(new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser fbUser = auth.getCurrentUser();
                loginError.setValue(null);
                if (fbUser == null) {
                    user.setValue(null);
                } else {
                    user.setValue(new User(fbUser));
                }
            }
        });
    }

    public MutableLiveData<User> getUser() {
        return user;
    }

    public void signUp(String email, String password) {
        auth.createUserWithEmailAndPassword(email, password);
//        .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
//            @Override
//            public void onComplete(@NonNull Task<AuthResult> task) {
//                AuthResult result = task.getResult();
//                if (result.getUser() == null) {
//                    loginError.setValue(new RuntimeException("Signup failed"));
//                }
//            }
//        });
    }

    public void signIn(String email, String password) {
        auth.signInWithEmailAndPassword(email, password);
    }

    public void signOut() {
        auth.signOut();
    }

    public void storeUserGoalData(Goal newGoal){
        if(user.getValue() == null) return;
        if(newGoal.task.equals("Steps")){
            database.child("userData").child(user.getValue().uid).child("goalList").child("StepGoal").setValue(newGoal);
        }
        else{
            database.child("userData").child(user.getValue().uid).child("goalList").child("ExerciseGoal").setValue(newGoal);
        }
    }

    public void updateGoalData(){}
}

