import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { exportService } from '../services/export.service';
import { sendSuccess } from '../../../utils/response';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reportService.getDashboardAnalytics();
    sendSuccess(res, data, 'Analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const exportPDF = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reportService.getDashboardAnalytics();
    exportService.generatePDF(res, data, 'EcoSphere Sustainability Report');
  } catch (error) {
    next(error);
  }
};

export const exportCSV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reportService.getDashboardAnalytics();
    
    // Convert analytics into a flat structure for CSV (e.g. array of key-value pairs)
    const flatData = [
      { Metric: 'Net Carbon Emissions (tons)', Value: data.environmental.netCarbon },
      { Metric: 'Total Carbon Offsets (tons)', Value: data.environmental.totalOffsets },
      { Metric: 'Total Volunteer Hours', Value: data.social.totalVolunteerHours },
      { Metric: 'Active Initiatives', Value: data.social.activeInitiativesCount },
    ];

    exportService.generateCSV(res, flatData, 'ecosphere_metrics');
  } catch (error) {
    next(error);
  }
};
