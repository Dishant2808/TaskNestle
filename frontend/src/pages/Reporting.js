import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader,
  FolderOpen,
  TrendingUp,
  Shield,
  BarChart3,
  Activity,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  User,
  Building
} from 'lucide-react';

const Reporting = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('completions');

  // Mock chart data
  const chartData = [
    { week: 'Jul 21', total: 15, unassigned: 0, patrick: 5, gaurav: 8, jone: 2, osinachi: 0 },
    { week: 'Jul 28', total: 25, unassigned: 0, patrick: 10, gaurav: 12, jone: 3, osinachi: 0 },
    { week: 'Aug 4', total: 18, unassigned: 0, patrick: 7, gaurav: 8, jone: 3, osinachi: 0 },
    { week: 'Aug 11', total: 22, unassigned: 0, patrick: 9, gaurav: 10, jone: 3, osinachi: 0 },
    { week: 'Aug 25', total: 30, unassigned: 0, patrick: 12, gaurav: 15, jone: 3, osinachi: 0 },
    { week: 'Sep 8', total: 45, unassigned: 0, patrick: 18, gaurav: 20, jone: 7, osinachi: 0 },
    { week: 'Sep 15', total: 35, unassigned: 0, patrick: 14, gaurav: 16, jone: 5, osinachi: 0 },
    { week: 'Sep 22', total: 28, unassigned: 0, patrick: 11, gaurav: 13, jone: 4, osinachi: 0 },
    { week: 'Sep 29', total: 32, unassigned: 0, patrick: 12, gaurav: 15, jone: 5, osinachi: 0 },
    { week: 'Oct 6', total: 38, unassigned: 0, patrick: 15, gaurav: 18, jone: 5, osinachi: 0 },
    { week: 'Oct 13', total: 31, unassigned: 0, patrick: 8, gaurav: 16, jone: 6, osinachi: 1 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.total));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reporting</h1>
            <p className="text-gray-600 mt-1">View weekly completion and creation metrics</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('completions')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'completions'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Completions
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Cards Completed by Week</h3>
          <p className="text-sm text-gray-500">Number of cards completed each week by assignee (last 12 weeks)</p>
        </div>

        {/* Chart */}
        <div className="relative">
          <div className="flex items-end space-x-2 h-64">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full h-48 flex items-end">
                  {/* Stacked bars for recent weeks */}
                  {index >= 8 ? (
                    <>
                      <div 
                        className="w-full bg-purple-500 rounded-t"
                        style={{ height: `${(data.unassigned / maxValue) * 100}%` }}
                        title="Unassigned"
                      />
                      <div 
                        className="w-full bg-blue-500"
                        style={{ height: `${(data.patrick / maxValue) * 100}%` }}
                        title="Patrick"
                      />
                      <div 
                        className="w-full bg-green-500"
                        style={{ height: `${(data.gaurav / maxValue) * 100}%` }}
                        title="Gaurav N"
                      />
                      <div 
                        className="w-full bg-orange-500"
                        style={{ height: `${(data.jone / maxValue) * 100}%` }}
                        title="Jone"
                      />
                      <div 
                        className="w-full bg-red-500"
                        style={{ height: `${(data.osinachi / maxValue) * 100}%` }}
                        title="Osinachi"
                      />
                    </>
                  ) : (
                    <div 
                      className="w-full bg-purple-500 rounded-t"
                      style={{ height: `${(data.total / maxValue) * 100}%` }}
                      title={`Total: ${data.total}`}
                    />
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500 transform -rotate-45 origin-left">
                  {data.week}
                </div>
              </div>
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-gray-500">
            <span>60</span>
            <span>45</span>
            <span>30</span>
            <span>15</span>
            <span>0</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-600">Unassigned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Patrick</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Gaurav N</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Jone</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Osinachi</span>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Completed</p>
              <p className="text-2xl font-semibold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Week</p>
              <p className="text-2xl font-semibold text-gray-900">31</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. per Week</p>
              <p className="text-2xl font-semibold text-gray-900">28.5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
          <BarChart3 className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Reporting;
