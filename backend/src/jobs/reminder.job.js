const cron = require("node-cron");
const { env } = require("../config/env");
const { notificationService } = require("../services/notification.service");

const startReminderJob = () => {
  if (!env.REMINDER_JOB_ENABLED) {
    return {
      stop() {},
    };
  }

  const task = cron.schedule(env.REMINDER_JOB_CRON, async () => {
    try {
      const result = await notificationService.runReminderCycle();
      console.log("Reminder job completed", result);
    } catch (error) {
      console.error("Reminder job failed", error);
    }
  });

  return {
    stop() {
      task.stop();
    },
  };
};

module.exports = {
  startReminderJob,
};
