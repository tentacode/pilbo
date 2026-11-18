import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import { registerBackgroundReminderActions } from "./reminderActionSupport";

jest.mock("expo-task-manager", () => ({ defineTask: jest.fn() }));
jest.mock("expo-notifications", () => ({
  registerTaskAsync: jest.fn(() => Promise.resolve(null)),
}));

type TaskExecutor = (body: { data: Notifications.NotificationTaskPayload }) => Promise<void>;

function registerTask(handleResponse: jest.Mock): TaskExecutor {
  registerBackgroundReminderActions(handleResponse);
  const [taskName, executor] = jest.mocked(TaskManager.defineTask).mock.calls[0];
  expect(Notifications.registerTaskAsync).toHaveBeenCalledWith(taskName);
  return executor as unknown as TaskExecutor;
}

describe("registerBackgroundReminderActions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("handles the response of an action button", async () => {
    const handleResponse = jest.fn(() => Promise.resolve());
    const executeTask = registerTask(handleResponse);
    const response = {
      actionIdentifier: "intake-reminder-taken",
    } as Notifications.NotificationResponse;

    await executeTask({ data: response });

    expect(handleResponse).toHaveBeenCalledWith(response);
  });

  it("ignores a received notification", async () => {
    const handleResponse = jest.fn(() => Promise.resolve());
    const executeTask = registerTask(handleResponse);

    await executeTask({ data: { notification: null, data: {} } });

    expect(handleResponse).not.toHaveBeenCalled();
  });
});
