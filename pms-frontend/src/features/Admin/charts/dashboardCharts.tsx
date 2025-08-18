import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";

const revenueData = [
  { month: 'Jan', revenue: 1800 },
  { month: 'Feb', revenue: 2200 },
  { month: 'Mar', revenue: 2000 },
  { month: 'Apr', revenue: 1900 },
  { month: 'May', revenue: 2500 },
  { month: 'June', revenue: 2400 },
  { month: 'July', revenue: 2600 }
];

const appointmentsData = [
  { month: 'Jan', appointments: 50 },
  { month: 'Feb', appointments: 75 },
  { month: 'Mar', appointments: 60 },
  { month: 'Apr', appointments: 80 },
  { month: 'May', appointments: 95 },
  { month: 'June', appointments: 85 },
  { month: 'July', appointments: 100 }
];

export default function DashboardCharts() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Appointments Line Chart */}
      <div className="w-full h-[250px] md:h-[350px] p-4 bg-white rounded-xl shadow">
        <ResponsiveContainer>
          <LineChart data={appointmentsData}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#lineGradient)"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Bar Chart */}
      <div className="w-full h-[250px] md:h-[350px] p-4 bg-white rounded-xl shadow">
        <ResponsiveContainer>
          <BarChart data={revenueData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}


