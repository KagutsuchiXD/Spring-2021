package com.afrotodos.api.viewmodels;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.ObservableArrayList;
import androidx.lifecycle.ViewModel;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.afrotodos.api.models.TodoItem;

public class TodoListViewModel extends ViewModel {
    private ObservableArrayList<TodoItem> todoList;
    private DatabaseReference db;

    public TodoListViewModel(){db = FirebaseDatabase.getInstance().getReference();}

    public ObservableArrayList<TodoItem> getTodoList(){
        if (todoList == null){
            todoList = new ObservableArrayList<TodoItem>();
            loadTodoList();
        }
        return todoList;
    }

    private void loadTodoList(){
        db.child("/todoList").addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {
                TodoItem task = snapshot.getValue(TodoItem.class);
                task.id = snapshot.getKey();
                todoList.add(task);
                Log.d("ADDED", "A contact was added");
            }

            @Override
            public void onChildChanged(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {
                TodoItem task = snapshot.getValue(TodoItem.class);
                task.id = snapshot.getKey();
                int index = todoList.indexOf(task);
                todoList.set(index, task);
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

    public void updateTask(String id, Boolean check){

        db.child("/todoList").child(id).child("checked").setValue(check);

    }

    public void saveTodo(String task){
        TodoItem newTask = new TodoItem(task);
        db.child("/todoList").push().setValue(newTask);
    }
}
