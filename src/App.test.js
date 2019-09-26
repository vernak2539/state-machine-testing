import React from "react";
import { Machine } from "xstate";
import { createModel } from "@xstate/test";
import { render, fireEvent } from "@testing-library/react";
import App, { todosMachineConfig } from "./App";

describe("App", () => {
  todosMachineConfig.states.idle.meta = {
    test: ({ getByText }) => {
      expect(getByText("Loading...")).toBeTruthy();
    }
  };

  todosMachineConfig.states.list.meta = {
    test: ({ getByText, container }) => {
      expect(getByText("Add Todo")).toBeTruthy();
      expect(container.getElementsByTagName("img")).toBeTruthy();
    }
  };

  todosMachineConfig.states.add.meta = {
    test: ({ getByText }) => {
      expect(getByText("Create Todo")).toBeTruthy();
    }
  };

  const todosMachine = Machine(todosMachineConfig);

  const todoModel = createModel(todosMachine, {
    done: {
      invoke: {
        fetchCatFacts: () => {}
      }
    }
  }).withEvents({
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

  describe("adding a todo", () => {
    const testPlans = todoModel.getSimplePathPlans();

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
