package com.connorosbornefitnesstrackerproject1.api.models;

import androidx.annotation.Nullable;

import com.google.firebase.database.Exclude;
import com.google.firebase.database.IgnoreExtraProperties;

@IgnoreExtraProperties
public class Goal {
    public String task;
    public int amount;
    public int progress;

    @Exclude
    public String id;

    public Goal() {}

    public Goal(String task, int amount){
        this.task = task;
        this.amount = amount;
        this.progress = 0;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        if (obj instanceof Goal) {
            Goal other = (Goal) obj;
            return other.id.equals(id);
        }
        return false;
    }
}