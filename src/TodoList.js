import React from "react";
import PropTypes from "prop-types";

const TodoList = ({ todos }) => {
  return (
    <ul>
      {todos.map(todo => {
        return <li>{todo.title}</li>;
      })}
    </ul>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      done: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired
    })
  )
};

TodoList.defaultProps = {
  todos: []
};

export default TodoList;
