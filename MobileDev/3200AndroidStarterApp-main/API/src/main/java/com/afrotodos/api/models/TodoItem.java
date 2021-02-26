package com.afrotodos.api.models;

import androidx.annotation.Nullable;

import com.google.firebase.database.Exclude;
import com.google.firebase.database.IgnoreExtraProperties;

@IgnoreExtraProperties
public class TodoItem {
    public String task;
    public Boolean checked;

    @Exclude
    public String id;

    public TodoItem() {}

    public TodoItem(String task){
        this.task = task;
        this.checked = false;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        if (obj instanceof TodoItem) {
            TodoItem other = (TodoItem) obj;
            return other.id.equals(id);
        }
        return false;
    }
}
