import { notificationTab } from "./notificationTab";

describe("notificationTab", () => {
  it("opens the today tab for an intake reminder", () => {
    expect(notificationTab("reminder-intake-1-2026-11-08T09:00")).toBe("today");
  });

  it("opens the meds tab for a low stock alert", () => {
    expect(notificationTab("low-stock-2026-11-21")).toBe("meds");
  });

  it("opens the today tab for an unknown notification", () => {
    expect(notificationTab("unknown")).toBe("today");
  });
});
