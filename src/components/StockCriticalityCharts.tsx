import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type StockCriticalityChartsProps = {
  items: any[];
};

export function StockCriticalityCharts({ items }: StockCriticalityChartsProps) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={items}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
