<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try {
            $tasks = Task::where('user_id', auth()->id())->get();
            return response()->json(['success' => 'Tasks fetched successfully', 'tasks' => $tasks], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Failed to fetch tasks', 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        try {
            $validate = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $task = Task::create([
                'user_id' => auth()->id(),
                'title' => $validate['title'],
                'description' => $validate['description'] ?? null,
                'completed' => false
            ]);
            return response()->json(['success' => 'Task created successfully', 'task' => $task], 201);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Failed to create task', 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $task = Task::where('id', $id)->where('user_id', auth()->id())->first();
        return response()->json(['success' => 'Task fetched successfully', 'task' => $task], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        try {
            $task = Task::where('user_id', auth()->id())->findOrFail($id);
            $validate = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|nullable|string',
                'completed' => 'sometimes|required|boolean',
            ]);
            $task->update($validate);
            return response()->json(['success' => 'Task updated successfully', 'task' => $task], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Failed to update task', 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $task = Task::where('user_id', auth()->id())->findOrFail($id);
            $task->delete();
            return response()->json(['success' => 'Task deleted successfully'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Failed to delete task', 'message' => $th->getMessage()], 500);
        }
    }
}
