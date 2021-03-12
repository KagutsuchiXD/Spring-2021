package com.afrotodos.watchapp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.ObservableList;
import androidx.lifecycle.ViewModelProvider;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.LinearLayout;

import com.afrotodos.api.viewmodels.TodoListViewModel;
import com.afrotodos.api.models.TodoItem;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        LinearLayout todoList = findViewById(R.id.watchlist);
        TodoListViewModel viewModel = new ViewModelProvider(this).get(TodoListViewModel.class);
        viewModel.getTodoList().addOnListChangedCallback(new ObservableList.OnListChangedCallback() {
            @Override
            public void onChanged(ObservableList sender) {

            }

            @Override
            public void onItemRangeChanged(ObservableList sender, int positionStart, int itemCount) {
                TodoItem task = viewModel.getTodoList().get(positionStart);
                View thisCheckbox = todoList.getChildAt(positionStart);
                CheckBox checkbox = thisCheckbox.findViewById(R.id.taskCheck);
                checkbox.setChecked(task.checked);
            }

            @Override
            public void onItemRangeInserted(ObservableList sender, int positionStart, int itemCount) {
                TodoItem task = viewModel.getTodoList().get(positionStart);
                View todoListItem = LayoutInflater.from(MainActivity.this).inflate(R.layout.todo_list_item, null);
                CheckBox taskCheck = todoListItem.findViewById(R.id.taskCheck);
                taskCheck.setChecked(task.checked);
                taskCheck.setText(task.task);
                todoList.addView(todoListItem);

                taskCheck.setOnClickListener((view)->{
                    viewModel.updateTask(task.id, taskCheck.isChecked());
                });
            }

            @Override
            public void onItemRangeMoved(ObservableList sender, int fromPosition, int toPosition, int itemCount) {

            }

            @Override
            public void onItemRangeRemoved(ObservableList sender, int positionStart, int itemCount) {

            }
        });
    }
}