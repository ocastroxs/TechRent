'use client';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold text-white">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-slate-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ChartDonut({ data, title, subtitle, nameKey = 'name', valueKey = 'total', colorKey = 'color' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Sem dados disponíveis
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="mb-4">
          <h3 className="text-white font-semibold">{title}</h3>
          {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey={valueKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry[colorKey] || '#6366f1'}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderCustomLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
