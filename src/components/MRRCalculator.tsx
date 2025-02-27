
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import MRRChart from "@/components/MRRChart";

interface MRRProjection {
  month: number;
  customers: number;
  mrr: number;
  cumulativeRevenue: number;
}

const MRRCalculator = () => {
  const [monthlyTraffic, setMonthlyTraffic] = useState(1000);
  const [conversionRate, setConversionRate] = useState(2);
  const [averagePrice, setAveragePrice] = useState(49);
  const [monthlyChurn, setMonthlyChurn] = useState(5);
  const [projection, setProjection] = useState<MRRProjection[]>([]);

  // Calculate projections when inputs change
  useEffect(() => {
    calculateProjection();
  }, [monthlyTraffic, conversionRate, averagePrice, monthlyChurn]);

  const calculateProjection = () => {
    const months = 12;
    const results: MRRProjection[] = [];
    
    // Initial values
    let currentCustomers = 0;
    let cumulativeRevenue = 0;
    
    for (let i = 1; i <= months; i++) {
      // Calculate new customers from traffic and conversion rate
      const newCustomers = Math.floor(monthlyTraffic * (conversionRate / 100));
      
      // Calculate churned customers
      const churnedCustomers = Math.floor(currentCustomers * (monthlyChurn / 100));
      
      // Update current customers
      currentCustomers = currentCustomers + newCustomers - churnedCustomers;
      
      // Calculate MRR
      const mrr = currentCustomers * averagePrice;
      
      // Update cumulative revenue
      cumulativeRevenue += mrr;
      
      // Add to results
      results.push({
        month: i,
        customers: currentCustomers,
        mrr,
        cumulativeRevenue
      });
    }
    
    setProjection(results);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleTrafficChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyTraffic(parseInt(e.target.value) || 0);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAveragePrice(parseInt(e.target.value) || 0);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="monthlyTraffic">Monthly Traffic</Label>
              <span className="text-sm text-neutral-500">{monthlyTraffic.toLocaleString()} visitors</span>
            </div>
            <Input
              id="monthlyTraffic"
              type="number"
              value={monthlyTraffic}
              onChange={handleTrafficChange}
              min="0"
              className="focus:ring-neutral-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="conversionRate">Conversion Rate</Label>
              <span className="text-sm text-neutral-500">{conversionRate}%</span>
            </div>
            <Slider
              id="conversionRate"
              min={0}
              max={10}
              step={0.1}
              value={[conversionRate]}
              onValueChange={(value) => setConversionRate(value[0])}
              className="my-4"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="averagePrice">Average Price</Label>
              <span className="text-sm text-neutral-500">{formatCurrency(averagePrice)}/mo</span>
            </div>
            <Input
              id="averagePrice"
              type="number"
              value={averagePrice}
              onChange={handlePriceChange}
              min="0"
              className="focus:ring-neutral-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="monthlyChurn">Monthly Churn</Label>
              <span className="text-sm text-neutral-500">{monthlyChurn}%</span>
            </div>
            <Slider
              id="monthlyChurn"
              min={0}
              max={20}
              step={0.5}
              value={[monthlyChurn]}
              onValueChange={(value) => setMonthlyChurn(value[0])}
              className="my-4"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {projection.length > 0 && (
            <>
              <Card className="p-4 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-lg">
                <h3 className="text-sm font-medium opacity-80">Month 12 MRR</h3>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(projection[projection.length - 1].mrr)}
                </p>
              </Card>
              
              <Card className="p-4 bg-white shadow-md border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-600">Projected Customers</h3>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {projection[projection.length - 1].customers.toLocaleString()}
                </p>
              </Card>
              
              <Card className="p-4 bg-white shadow-md border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-600">12-Month Revenue</h3>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {formatCurrency(projection[projection.length - 1].cumulativeRevenue)}
                </p>
              </Card>
            </>
          )}
        </div>
      </div>

      <div className="h-80 mt-8">
        <MRRChart data={projection} />
      </div>
    </div>
  );
};

export default MRRCalculator;
