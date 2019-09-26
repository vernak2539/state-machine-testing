import React, { useCallback, useState } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import TodoList from "./TodoList";
import AddTodo from "./AddTodo";

export const todosMachineConfig = {
  id: "todosApp",
  initial: "idle",
  context: {
    data: undefined,
    error: undefined
  },
  states: {
    idle: {
      invoke: {
        src: "fetchCatFacts",
        onDone: {
          target: "list",
          actions: assign({
            data: (_, event) => {
              // debugger;
              return event.data;
            }
          })
        },
        onError: {
          target: "failure",
          actions: assign({
            error: (_, event) => {
              // debugger;
              return event.data;
            }
          })
        }
      }
    },
    list: {
      on: {
        ADD_TODO: "add"
      }
    },
    add: {
      on: {
        CREATE_TODO: "list",
        CANCEL_ADD: "list"
      }
    },
    failure: {}
  }
};

const todosMachine = Machine(todosMachineConfig);

function App() {
  const [todos, setTodos] = useState([]);
  const [current, send] = useMachine(todosMachine, {
    services: {
      fetchCatFacts: (_, event) => {
        // debugger;
        return fetch("https://dog.ceo/api/breeds/image/random")
          .then(res => res.json())
          .then(data => data.message);
      }
    }
  });

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
      {current.matches("idle") && <div>Loading...</div>}
      {current.matches("failure") && <div>Failed to fetch fact</div>}

      {current.matches("list") && (
        <>
          <TodoList todos={todos} />
          <button onClick={addTodoView}>Add Todo</button>
        </>
      )}
      {current.matches("add") && (
        <AddTodo onCancelAdd={todoListView} onAddTodo={onAddTodo} />
      )}

      {current.context.data && (
        <>
          <br />
          <img src={current.context.data} />
        </>
      )}
    </div>
  );
}

export default App;
