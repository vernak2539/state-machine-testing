import React, { useCallback, useState } from "react";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import TodoList from "./TodoList";
import AddTodo from "./AddTodo";

const todosMachine = Machine({
  id: "todosApp",
  initial: "list",
  states: {
    list: {
      on: {
        ADD_TODO: "add"
      }
    },
    add: {
      on: {
        CREATE_TODO: "list"
      }
    }
  }
});

function App() {
  const [todos, setTodos] = useState([]);
  const [current, send] = useMachine(todosMachine);

  const addTodoView = useCallback(
    () => {
      send("ADD_TODO");
    },
    [send]
  );

  const todoListView = useCallback(
    () => {
      send("CREATE_TODO");
    },
    [send]
  );

  const onAddTodo = useCallback(
    title => {
      setTodos([
        ...todos,
        {
          title,
          id: todos.length + 1,
          done: false
        }
      ]);
      todoListView();
    },
    [todos, setTodos, todoListView]
  );

  return (
    <div>
      {current.matches("list") && (
        <>
          <TodoList todos={todos} />
          <button onClick={addTodoView}>Add Todo</button>
        </>
      )}
      {current.matches("add") && (
        <AddTodo onCancelAdd={todoListView} onAddTodo={onAddTodo} />
      )}
    </div>
  );
}

export default App;
