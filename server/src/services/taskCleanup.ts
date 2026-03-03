import cron from "node-cron";
import { lt } from "drizzle-orm";
import { db } from "@/config/db";
import { tasks } from "@/models/index";
import { logger } from "@/utils/logger";

export const initCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      logger.info("Starting background job: Cleaning up old tasks...");

      const fiveMonthsAgo = new Date();
      fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

      const deletedTasks = await db
        .delete(tasks)
        .where(lt(tasks.deadline, fiveMonthsAgo))
        .returning();

      logger.info(
        `Cleanup complete. Deleted ${deletedTasks.length} old tasks.`,
      );
    } catch (error) {
      logger.error("Failed to run task cleanup cron job:", error);
    }
  });

  logger.info("Cron jobs initialized.");
};
