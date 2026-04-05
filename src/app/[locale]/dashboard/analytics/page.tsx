"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { sidebarDictionary as enDict } from "@/dict/Dashboard/common/en";
import { sidebarDictionary as arDict } from "@/dict/Dashboard/common/ar";
import { BarChart3, TrendingUp, Eye, Users } from "lucide-react";

export default function AnalyticsPage() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  const analyticsData = [
    {
      title: "Page Views",
      value: "45,231",
      change: "+12%",
      icon: <Eye className="w-5 h-5" />,
      color: "text-blue-600",
    },
    {
      title: "Unique Visitors",
      value: "12,543",
      change: "+8%",
      icon: <Users className="w-5 h-5" />,
      color: "text-green-600",
    },
    {
      title: "Bounce Rate",
      value: "32.4%",
      change: "-2%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-yellow-600",
    },
    {
      title: "Avg. Session Duration",
      value: "3m 24s",
      change: "+15%",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {dictionary.analytics}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your website traffic and user engagement metrics.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.title}
                </span>
              </div>
              <span className={`text-sm font-medium ${item.color}`}>
                {item.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Traffic Overview
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Traffic chart will be displayed here
              </p>
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            User Activity
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                User activity chart will be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
