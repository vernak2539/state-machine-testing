import React from "react";
import ReactDOM from "react-dom";
import { Machine } from "xstate";
import { createModel } from "@xstate/test";

import { render, fireEvent } from "@testing-library/react";

import App from "./App";

describe("App", () => {
  const todosMachine = Machine({
    id: "todosApp",
    initial: "list",
    states: {
      add: {
        on: {
          CANCEL_ADD: "list",
          CREATE_TODO: "list"
        },
        meta: {
          test: ({ getByText }) => {
            expect(getByText("Create Todo")).toBeTruthy();
          }
        }
      },
      list: {
        on: {
          ADD_TODO: "add"
        },
        meta: {
          test: ({ getByText }) => {
            expect(getByText("Add Todo")).toBeTruthy();
          }
        }
      }
    }
  });

  const todoModel = createModel(todosMachine).withEvents({
    ADD_TODO: ({ getByText }) => {
      fireEvent.click(getByText("Add Todo"));
    },
    CREATE_TODO: ({ getByText, getByLabelText }) => {
      const input = getByLabelText("add-input");

      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.click(getByText("Add"));
      // TODO: how do I verify the correct input was added to the next screen (TodoList)
    },
    CANCEL_ADD: ({ getByText }) => {
      fireEvent.click(getByText("Cancel"));
    }
  });

  const testPlans = todoModel.getShortestPathPlans();

  describe("adding a todo", () => {
    testPlans.forEach(plan => {
      describe(plan.description, () => {
        plan.paths.forEach(path => {
          it(path.description, async () => {
            const rendered = render(<App />);
            await path.test(rendered);
          });
        });
      });
    });
  });

  it("coverage", () => {
    todoModel.testCoverage();
  });
});
