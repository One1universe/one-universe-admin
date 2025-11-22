import { HttpService } from "./httpService";

class DashboardService {
  private request = new HttpService();

  async getDashboardMonthlyStats() {
    // Pass useAuth = true to include authentication token
    return this.request.get("/admin/users/dashboard-stats/monthly", true);
  }

  async getDashboardChartGrowth(filter: "monthly" | "weekly" | "daily") {
    // Pass useAuth = true to include authentication token
    return this.request.get(
      `/admin/users/dashboard-stats/user-growth-chart?period=${filter}`,
      true
    );
  }
}

const dashboardService = new DashboardService();
export default dashboardService;