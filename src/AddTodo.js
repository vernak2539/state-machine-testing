import React, { useCallback, useState } from "react";

const AddTodo = ({ onAddTodo, onCancelAdd }) => {
  const [title, setTitle] = useState("");
  const addTodo = useCallback(
    () => {
      onAddTodo(title);
    },
    [title, onAddTodo]
  );

  return (
    <label htmlFor="add-input">
      <input
        id="add-input"
        value={title}
        onChange={({ target }) => {
          setTitle(target.value);
        }}
      />
      <button onClick={addTodo}>Create Todo</button>
      <button onClick={onCancelAdd}>Cancel</button>
    </label>
  );
};

export default AddTodo;
