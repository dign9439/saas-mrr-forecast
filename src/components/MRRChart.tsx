
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface MRRProjection {
  month: number;
  customers: number;
  mrr: number;
  cumulativeRevenue: number;
}

interface MRRChartProps {
  data: MRRProjection[];
}

const MRRChart = ({ data }: MRRChartProps) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-neutral-100 animate-pulse rounded-md"></div>;

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-md border border-neutral-200 rounded-md">
          <p className="font-medium text-neutral-900">{`Month ${label}`}</p>
          <p className="text-neutral-800">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            MRR: {formatTooltipValue(payload[0].value)}
          </p>
          <p className="text-neutral-800">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
            Customers: {payload[1].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: isMobile ? 0 : 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          label={{ 
            value: 'Month', 
            position: 'insideBottomRight', 
            offset: -5 
          }}
        />
        <YAxis 
          yAxisId="left"
          tickFormatter={formatYAxis}
          label={isMobile ? null : { 
            value: 'MRR ($)', 
            angle: -90, 
            position: 'insideLeft'
          }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 'auto']}
          label={isMobile ? null : { 
            value: 'Customers', 
            angle: 90, 
            position: 'insideRight' 
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="mrr"
          name="MRR"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="customers"
          name="Customers"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MRRChart;
